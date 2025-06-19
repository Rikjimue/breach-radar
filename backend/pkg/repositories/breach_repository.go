package repositories

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/Rikjimue/breach-radar/backend/pkg/models"
	"github.com/lib/pq"
)

type BreachRepository interface {
	GetBreachesWithFields(ctx context.Context, fieldNames []string) ([]models.BreachMetadata, error)
	FindExactMatches(ctx context.Context, breachName string, fieldHashes map[string]string) ([]string, error)
	FindSensitiveMatches(ctx context.Context, fieldType, partialHash string) (map[string][]string, error)
	GetBreachMetadata(ctx context.Context, breachName string) (*models.BreachMetadata, error)
}

type SQLBreachRepository struct {
	db *sql.DB
}

func NewSQLBreachRepository(db *sql.DB) *SQLBreachRepository {
	return &SQLBreachRepository{db: db}
}

func (r *SQLBreachRepository) GetBreachesWithFields(ctx context.Context, fieldNames []string) ([]models.BreachMetadata, error) {
	query := `
		SELECT name, display_name, breach_date, affected_records, fields
		FROM breach_metadata 
		WHERE fields && $1
		ORDER BY breach_date DESC`

	rows, err := r.db.QueryContext(ctx, query, pq.Array(fieldNames))
	if err != nil {
		return nil, fmt.Errorf("error querying breach metadata: %w", err)
	}
	defer rows.Close()

	var breaches []models.BreachMetadata
	for rows.Next() {
		var breach models.BreachMetadata
		if err := rows.Scan(&breach.Name, &breach.DisplayName, &breach.Date, &breach.AffectedRecords, pq.Array(&breach.Fields)); err != nil {
			continue
		}
		breaches = append(breaches, breach)
	}

	return breaches, nil
}

func (r *SQLBreachRepository) GetBreachMetadata(ctx context.Context, breachName string) (*models.BreachMetadata, error) {
	query := `SELECT name, display_name, breach_date, affected_records FROM breach_metadata WHERE name = $1`

	var metadata models.BreachMetadata
	err := r.db.QueryRowContext(ctx, query, breachName).Scan(
		&metadata.Name,
		&metadata.DisplayName, // Added display_name
		&metadata.Date,
		&metadata.AffectedRecords,
	)
	if err != nil {
		return nil, fmt.Errorf("error getting breach metadata for %s: %w", breachName, err)
	}

	return &metadata, nil
}

func (r *SQLBreachRepository) FindExactMatches(ctx context.Context, breachName string, fieldHashes map[string]string) ([]string, error) {
	var matchedFields []string

	for fieldType, fullHash := range fieldHashes {
		columnName := r.getColumnName(fieldType)
		if columnName == "" {
			continue
		}

		query := fmt.Sprintf(`
			SELECT COUNT(*) 
			FROM %s 
			WHERE %s = $1`,
			pq.QuoteIdentifier(breachName),
			pq.QuoteIdentifier(columnName),
		)

		var count int
		err := r.db.QueryRowContext(ctx, query, fullHash).Scan(&count)
		if err != nil {
			continue
		}

		if count > 0 {
			matchedFields = append(matchedFields, fieldType)
		}
	}

	return matchedFields, nil
}

func (r *SQLBreachRepository) FindSensitiveMatches(ctx context.Context, fieldType, partialHash string) (map[string][]string, error) {
	tableName := r.getSensitiveTableName(fieldType)
	if tableName == "" {
		return nil, fmt.Errorf("unsupported sensitive field type: %s", fieldType)
	}

	columnName := fieldType + "_hash"

	query := fmt.Sprintf(`
		SELECT breach_source, %s
		FROM %s 
		WHERE %s LIKE $1
		LIMIT 1000`,
		pq.QuoteIdentifier(columnName),
		pq.QuoteIdentifier(tableName),
		pq.QuoteIdentifier(columnName),
	)

	rows, err := r.db.QueryContext(ctx, query, partialHash+"%")
	if err != nil {
		return nil, fmt.Errorf("error querying sensitive data table %s: %w", tableName, err)
	}
	defer rows.Close()

	breachCandidates := make(map[string][]string)
	for rows.Next() {
		var breachSource, fullHash string
		if err := rows.Scan(&breachSource, &fullHash); err != nil {
			continue
		}
		breachCandidates[breachSource] = append(breachCandidates[breachSource], fullHash)
	}

	return breachCandidates, nil
}

func (r *SQLBreachRepository) getSensitiveTableName(fieldType string) string {
	sensitiveTableMap := map[string]string{
		"ssn":           "breach_ssn_data",
		"creditCard":    "breach_credit_card_data",
		"driverLicense": "breach_license_data",
		"passport":      "breach_passport_data",
		"password":      "breach_password_data",
	}
	return sensitiveTableMap[fieldType]
}

func (r *SQLBreachRepository) getColumnName(fieldType string) string {
	columnMap := map[string]string{
		"email":       "email",
		"firstName":   "first_name",
		"lastName":    "last_name",
		"phone":       "phone",
		"username":    "username",
		"address":     "address",
		"city":        "city",
		"state":       "state",
		"zipCode":     "zip_code",
		"country":     "country",
		"dateOfBirth": "date_of_birth",
	}
	return columnMap[fieldType]
}

func (r *SQLBreachRepository) CheckTableExists(ctx context.Context, tableName string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT FROM information_schema.tables 
			WHERE table_schema = 'public' 
			AND table_name = $1
		)`

	var exists bool
	err := r.db.QueryRowContext(ctx, query, tableName).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("error checking table existence: %w", err)
	}

	return exists, nil
}

func (r *SQLBreachRepository) GetAvailableFields(ctx context.Context) ([]string, error) {
	query := `
		SELECT DISTINCT unnest(fields) as field_name 
		FROM breach_metadata 
		ORDER BY field_name`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("error getting available fields: %w", err)
	}
	defer rows.Close()

	var fields []string
	for rows.Next() {
		var field string
		if err := rows.Scan(&field); err != nil {
			continue
		}
		fields = append(fields, field)
	}

	return fields, nil
}

func (r *SQLBreachRepository) GetBreachCount(ctx context.Context) (int, error) {
	query := `SELECT COUNT(*) FROM breach_metadata`

	var count int
	err := r.db.QueryRowContext(ctx, query).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error getting breach count: %w", err)
	}

	return count, nil
}
