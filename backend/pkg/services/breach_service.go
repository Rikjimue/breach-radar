package services

import (
	"context"
	"fmt"

	"github.com/Rikjimue/TECH120-Prototype/backend/pkg/models"
	"github.com/Rikjimue/TECH120-Prototype/backend/pkg/repositories"
)

type BreachService struct {
	breachRepo repositories.BreachRepository
}

func NewBreachService(breachRepo repositories.BreachRepository) *BreachService {
	return &BreachService{breachRepo: breachRepo}
}

func (s *BreachService) SearchBreach(ctx context.Context, req *models.NormalSearchRequest) (*models.NormalSearchResponse, error) {

	if req == nil {
		return nil, fmt.Errorf("invalid request: request is nil")
	}

	response, err := s.breachRepo.SearchBreachMatch(ctx, req.Fields)

	if err != nil {
		return nil, fmt.Errorf("error searching breach match -> %w", err)
	}

	return response, nil

	/*
		Get a map of the tables and an array of the fields
		{
			[tablename: []fields]
		}

		Go through the table and find the rowID with the most amount of matches. If there is none the tablename is removed from the map
		Then it creates breach matches from the ID

		SELECT breach_name,  FROM breach_metadata WHERE breach_fields && $1

		Use common table expressions to get find the common fields of a []map[fields]content. Query to see if the content is inside all the tables. Then format it for a response of one per each table that has the most fields matching.
	*/
}

func (s *BreachService) SearchSensitive(ctx context.Context, req *models.SensitiveSearchRequest) (*models.SensitiveSearchResponse, error) {
	// Request validation
	if req == nil {
		return nil, fmt.Errorf("invalid request: request is nil")
	}

	// Map of the hash combined with the table's metadata
	match, err := s.breachRepo.SearchSensitiveMatch(ctx, req.Field, req.Hash)

	if err != nil {
		return nil, fmt.Errorf("error searching sensitive data -> %w", err)
	}

	potentialMatches := make(map[string]*models.NormalSearchResponse)

	// For each hash found, create a NormalSearchResponse
	for hash, metadatas := range match {
		var matches []models.BreachMatch
		for _, metadata := range metadatas {
			// Convert metadata to match
			match := models.BreachMatch{
				ID:          metadata.ID,
				Name:        metadata.Name,
				Date:        metadata.Date,
				Description: metadata.Description,
				Severity:    metadata.Severity,
				Link:        metadata.Link,
				Fields:      make(map[string]string),
			}

			// Set all fields to "Can't Match" except the one that is being searched
			for _, field := range metadata.Fields {
				if field == req.Field {
					match.Fields[field] = "Match" // Only Partial Match, client verifies full match
				} else {
					match.Fields[field] = "Can't Match"
				}
			}

			matches = append(matches, match)
		}

		potentialMatches[hash] = &models.NormalSearchResponse{
			Matches: matches,
		}
	}

	// Put data into a response
	return &models.SensitiveSearchResponse{
		PotentialPasswords: potentialMatches,
	}, nil
}
