package repositories

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/Rikjimue/TECH120-Prototype/backend/pkg/models"
	"github.com/lib/pq"
)

type BreachRepository interface {
	SearchSensitiveMatch(ctx context.Context, field string, hash string) (map[string][]models.BreachMetadata, error)
	SearchBreachMatch(ctx context.Context, searchFields map[string]string) (*models.NormalSearchResponse, error)
}

type SQLBreachRepository struct {
	db *sql.DB
}

func NewSQLBreachRepository(db *sql.DB) *SQLBreachRepository {
	return &SQLBreachRepository{db: db}
}

func (r *SQLBreachRepository) SearchBreachMatch(ctx context.Context, searchFields map[string]string) (*models.NormalSearchResponse, error) {
	// Convert map keys to a comma-separated string for the query
	var fieldNames []string
	for field := range searchFields {
		fieldNames = append(fieldNames, field)
	}

	tablesQuery := `
        SELECT DISTINCT table_name 
        FROM breach_metadata 
        WHERE breach_fields && string_to_array($1, ',')`
	fieldNamesStr := strings.Join(fieldNames, ",")
	tableRows, err := r.db.Query(tablesQuery, fieldNamesStr)
	if err != nil {
		return nil, fmt.Errorf("error getting matching tables -> %v", err)
	}
	defer tableRows.Close()

	var matchingTables []string
	for tableRows.Next() {
		var tableName string
		if err := tableRows.Scan(&tableName); err != nil {
			return nil, fmt.Errorf("error scanning table name -> %v", err)
		}
		matchingTables = append(matchingTables, tableName)
	}

	if len(matchingTables) == 0 {
		return &models.NormalSearchResponse{Matches: []models.BreachMatch{}}, nil
	}

	var allMatches []models.BreachMatch
	seenMatches := make(map[uint64]bool)

	for _, tableName := range matchingTables {
		// First, get the columns that exist in this table
		columnsQuery := `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = $1`
		columnRows, err := r.db.Query(columnsQuery, tableName)
		if err != nil {
			return nil, fmt.Errorf("error getting columns for table %s -> %v", tableName, err)
		}

		existingColumns := make(map[string]bool)
		for columnRows.Next() {
			var columnName string
			if err := columnRows.Scan(&columnName); err != nil {
				columnRows.Close()
				return nil, fmt.Errorf("error scanning column name -> %v", err)
			}
			existingColumns[columnName] = true
		}
		columnRows.Close()

		var queryParams []interface{}
		paramCount := 1
		// Build conditions only for existing columns
		var conditions []string
		for field, value := range searchFields {
			if existingColumns[field] {
				conditions = append(conditions, fmt.Sprintf("%s = $%d", field, paramCount))
				queryParams = append(queryParams, value)
				paramCount++
			}
		}

		// If no valid conditions exist, skip this table
		if len(conditions) == 0 {
			continue
		}

		query := fmt.Sprintf(`
            SELECT
                m.breach_id,
                m.table_name,
                m.breach_date,
                m.breach_description,
                m.breach_severity,
                m.breach_link,
                json_build_object(
                    %s
                ) as fields
            FROM %s t
            JOIN breach_metadata m ON m.table_name = '%s'
            WHERE %s
            LIMIT 1`,
			buildFieldChecks(searchFields, existingColumns),
			tableName,
			tableName,
			strings.Join(conditions, " OR "))

		rows, err := r.db.Query(query, queryParams...)
		if err != nil {
			return nil, fmt.Errorf("error querying table %s -> %v", tableName, err)
		}

		for rows.Next() {
			var match models.BreachMatch
			var fieldsJSON []byte
			err := rows.Scan(
				&match.ID,
				&match.Name,
				&match.Date,
				&match.Description,
				&match.Severity,
				&match.Link,
				&fieldsJSON,
			)
			if err != nil {
				rows.Close()
				return nil, fmt.Errorf("error scanning match -> %v", err)
			}

			if seenMatches[match.ID] {
				continue
			}

			match.Fields = make(map[string]string)
			if err := json.Unmarshal(fieldsJSON, &match.Fields); err != nil {
				rows.Close()
				return nil, fmt.Errorf("error parsing fields JSON -> %v", err)
			}

			hasMatch := false
			for _, status := range match.Fields {
				if status == "Matched" {
					hasMatch = true
					break
				}
			}

			if hasMatch {
				seenMatches[match.ID] = true
				allMatches = append(allMatches, match)
			}
		}
		rows.Close()
	}

	return &models.NormalSearchResponse{
		Matches: allMatches,
	}, nil
}

// Updated helper function to handle non-existent fields
func buildFieldChecks(searchFields map[string]string, existingColumns map[string]bool) string {
	var fieldChecks []string
	for field, value := range searchFields {
		var fieldCheck string
		if existingColumns[field] {
			fieldCheck = fmt.Sprintf(`
                '%s',
                CASE
                    WHEN %[1]s = '%s' THEN 'Matched'
                    ELSE 'Not Matched'
                END`,
				field, value)
		} else {
			fieldCheck = fmt.Sprintf(`
                '%s',
                'Unable to Match'`,
				field)
		}
		fieldChecks = append(fieldChecks, fieldCheck)
	}
	return strings.Join(fieldChecks, ",\n")
}

// Change to common table expressions
func (r *SQLBreachRepository) SearchSensitiveMatch(ctx context.Context, field string, hash string) (map[string][]models.BreachMetadata, error) {
	// Find tables with the field
	breachRows, err := r.db.QueryContext(ctx, "SELECT * FROM breach_metadata WHERE $1 = ANY(breach_fields)", field)

	if err != nil {
		return nil, fmt.Errorf("error querying for field-table matches-> %w", err)
	}
	defer breachRows.Close()

	var breaches []models.BreachMetadata
	for breachRows.Next() {
		var breach_metadata models.BreachMetadata
		if err := breachRows.Scan(
			&breach_metadata.ID,
			&breach_metadata.Name,
			&breach_metadata.Date,
			&breach_metadata.Description,
			&breach_metadata.Severity,
			pq.Array(&breach_metadata.Fields),
			&breach_metadata.Link,
		); err != nil {
			return nil, fmt.Errorf("error scanning metadata -> %w", err)
		}
		breaches = append(breaches, breach_metadata)
	}

	// TODO: Change to use go routines
	// Search for the hash inside these tables
	matches := make(map[string][]models.BreachMetadata)
	for _, breach_metadata := range breaches {
		query := fmt.Sprintf(
			"SELECT DISTINCT %s FROM %s WHERE %s LIKE $1",
			pq.QuoteIdentifier(field),                // Column name
			pq.QuoteIdentifier(breach_metadata.Name), // Table name
			pq.QuoteIdentifier(field),                // Column name again
		)

		// Then use the query with parameter for the value
		rows, err := r.db.QueryContext(ctx, query, hash+"%")
		if err != nil {
			return nil, fmt.Errorf("error querying partial hash -> %w", err)
		}
		// Each row = different hash string
		for rows.Next() {
			var hash string
			if err := rows.Scan(
				&hash,
			); err != nil {
				return nil, fmt.Errorf("error scanning partial hash -> %w", err)
			}
			matches[hash] = append(matches[hash], breach_metadata)
		}
	}
	return matches, nil
}
