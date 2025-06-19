package services

import (
	"context"
	"fmt"

	"github.com/Rikjimue/breach-radar/backend/pkg/models"
	"github.com/Rikjimue/breach-radar/backend/pkg/repositories"
)

type BreachService struct {
	breachRepo repositories.BreachRepository
}

func NewBreachService(breachRepo repositories.BreachRepository) *BreachService {
	return &BreachService{breachRepo: breachRepo}
}

func (s *BreachService) BreachSearch(ctx context.Context, req *models.BreachSearchRequest) (interface{}, error) {
	if req.Mode == "sensitive" {
		return s.searchSensitiveData(ctx, req.Fields)
	}
	return s.searchPersonalData(ctx, req.Fields)
}

func (s *BreachService) searchPersonalData(ctx context.Context, fieldHashes map[string]string) (*models.PersonalSearchResponse, error) {
	fieldNames := make([]string, 0, len(fieldHashes))
	for field := range fieldHashes {
		fieldNames = append(fieldNames, field)
	}

	breaches, err := s.breachRepo.GetBreachesWithFields(ctx, fieldNames)
	if err != nil {
		return nil, fmt.Errorf("failed to get breaches: %w", err)
	}

	var exactMatches []models.ExactMatch

	for _, breach := range breaches {
		matchedFields, err := s.breachRepo.FindExactMatches(ctx, breach.Name, fieldHashes)
		if err != nil {
			continue
		}

		if len(matchedFields) > 0 {
			isPartialMatch := len(matchedFields) < len(fieldHashes)

			exactMatch := models.ExactMatch{
				Name:            breach.DisplayName, // Use display_name instead of name
				Date:            breach.Date.Format("2006-01-02"),
				AffectedRecords: s.formatRecordCount(int(breach.AffectedRecords)),
				MatchedFields:   matchedFields,
				PartialMatch:    isPartialMatch,
			}
			exactMatches = append(exactMatches, exactMatch)
		}
	}

	return &models.PersonalSearchResponse{
		ExactMatches: exactMatches,
		SearchFields: fieldNames,
	}, nil
}

func (s *BreachService) searchSensitiveData(ctx context.Context, fieldHashes map[string]string) (*models.SensitiveSearchResponse, error) {
	var candidateBreaches []models.BreachCandidate

	for fieldType, partialHash := range fieldHashes {
		breachCandidates, err := s.breachRepo.FindSensitiveMatches(ctx, fieldType, partialHash)
		if err != nil {
			continue
		}

		for breachSource, hashes := range breachCandidates {
			metadata, err := s.breachRepo.GetBreachMetadata(ctx, breachSource)
			if err != nil {
				continue
			}

			candidate := models.BreachCandidate{
				Name:            metadata.DisplayName, // Use display_name instead of name
				Date:            metadata.Date.Format("2006-01-02"),
				AffectedRecords: s.formatRecordCount(int(metadata.AffectedRecords)),
				HashCandidates:  map[string][]string{fieldType: hashes},
				PartialMatch:    false,
			}

			candidateBreaches = append(candidateBreaches, candidate)
		}
	}

	fieldNames := make([]string, 0, len(fieldHashes))
	for field := range fieldHashes {
		fieldNames = append(fieldNames, field)
	}

	return &models.SensitiveSearchResponse{
		CandidateBreaches: candidateBreaches,
		SearchFields:      fieldNames,
	}, nil
}

func (s *BreachService) formatRecordCount(count int) string {
	if count >= 1000000000 {
		return fmt.Sprintf("%.1fB", float64(count)/1000000000)
	} else if count >= 1000000 {
		return fmt.Sprintf("%.1fM", float64(count)/1000000)
	} else if count >= 1000 {
		return fmt.Sprintf("%.1fK", float64(count)/1000)
	}
	return fmt.Sprintf("%d", count)
}
