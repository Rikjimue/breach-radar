package repositories

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Rikjimue/breach-radar/backend/pkg/models"
)

// ======================================
// MOCK REPOSITORY IMPLEMENTATION
// ======================================

type MockBreachRepository struct {
	breaches      map[string]models.BreachMetadata
	personalData  map[string]map[string]string
	sensitiveData map[string][]SensitiveEntry
}

type SensitiveEntry struct {
	BreachSource string
	Hash         string
}

func NewMockBreachRepository() *MockBreachRepository {
	mock := &MockBreachRepository{
		breaches:      make(map[string]models.BreachMetadata),
		personalData:  make(map[string]map[string]string),
		sensitiveData: make(map[string][]SensitiveEntry),
	}
	mock.loadMockData()
	return mock
}

func (m *MockBreachRepository) loadMockData() {
	linkedinDate, _ := time.Parse("2006-01-02", "2021-06-18")
	facebookDate, _ := time.Parse("2006-01-02", "2019-09-04")
	passwordDate, _ := time.Parse("2006-01-02", "2020-03-15")

	m.breaches["breach_linkedin_2021"] = models.BreachMetadata{
		Name:            "breach_linkedin_2021",
		Date:            linkedinDate,
		AffectedRecords: 700000000,
		Fields:          []string{"email", "firstName", "lastName", "username"},
	}

	m.breaches["breach_facebook_2019"] = models.BreachMetadata{
		Name:            "breach_facebook_2019",
		Date:            facebookDate,
		AffectedRecords: 419000000,
		Fields:          []string{"phone", "firstName", "username"},
	}

	m.breaches["breach_passwords_2020"] = models.BreachMetadata{
		Name:            "breach_passwords_2020",
		Date:            passwordDate,
		AffectedRecords: 500000000,
		Fields:          []string{"password"},
	}

	m.personalData["breach_linkedin_2021"] = map[string]string{
		"email":     "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
		"firstName": "f1e2d3c4b5a6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
		"lastName":  "b2c3d4e5f6a7789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
		"username":  "u1v2w3x4y5z6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
	}

	m.personalData["breach_facebook_2019"] = map[string]string{
		"phone":     "c3d4e5f6a7b8789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
		"firstName": "f1e2d3c4b5a6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
		"username":  "u9v8w7x6y5z4789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
	}

	m.sensitiveData["password"] = []SensitiveEntry{
		{BreachSource: "breach_passwords_2020", Hash: "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"},
		{BreachSource: "breach_passwords_2020", Hash: "a1b2c3d4f7g8h9i0789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"},
		{BreachSource: "breach_passwords_2020", Hash: "a1b2c3d4a5b6c7d8789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"},
		{BreachSource: "breach_passwords_2020", Hash: "z1y2x3w4v5u6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"},
	}
}

func (m *MockBreachRepository) GetBreachesWithFields(ctx context.Context, fieldNames []string) ([]models.BreachMetadata, error) {
	var result []models.BreachMetadata

	for _, breach := range m.breaches {
		hasField := false
		for _, field := range fieldNames {
			for _, breachField := range breach.Fields {
				if field == breachField {
					hasField = true
					break
				}
			}
			if hasField {
				break
			}
		}
		if hasField {
			result = append(result, breach)
		}
	}

	return result, nil
}

func (m *MockBreachRepository) FindExactMatches(ctx context.Context, breachName string, fieldHashes map[string]string) ([]string, error) {
	personalData, exists := m.personalData[breachName]
	if !exists {
		return []string{}, nil
	}

	var matchedFields []string
	for fieldType, hash := range fieldHashes {
		if storedHash, exists := personalData[fieldType]; exists && storedHash == hash {
			matchedFields = append(matchedFields, fieldType)
		}
	}

	return matchedFields, nil
}

func (m *MockBreachRepository) FindSensitiveMatches(ctx context.Context, fieldType, partialHash string) (map[string][]string, error) {
	entries, exists := m.sensitiveData[fieldType]
	if !exists {
		return map[string][]string{}, nil
	}

	result := make(map[string][]string)
	for _, entry := range entries {
		if strings.HasPrefix(entry.Hash, partialHash) {
			result[entry.BreachSource] = append(result[entry.BreachSource], entry.Hash)
		}
	}

	return result, nil
}

func (m *MockBreachRepository) GetBreachMetadata(ctx context.Context, breachName string) (*models.BreachMetadata, error) {
	breach, exists := m.breaches[breachName]
	if !exists {
		return nil, fmt.Errorf("breach not found: %s", breachName)
	}
	return &breach, nil
}
