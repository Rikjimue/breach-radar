// ======================================
// REPOSITORY TESTS
// ======================================

package repositories

import (
	"context"
	"testing"
)

func TestMockBreachRepository_GetBreachesWithFields(t *testing.T) {
	repo := NewMockBreachRepository()
	ctx := context.Background()

	tests := []struct {
		name        string
		fields      []string
		expectedLen int
	}{
		{
			name:        "email field",
			fields:      []string{"email"},
			expectedLen: 1,
		},
		{
			name:        "phone field",
			fields:      []string{"phone"},
			expectedLen: 1,
		},
		{
			name:        "firstName field",
			fields:      []string{"firstName"},
			expectedLen: 2,
		},
		{
			name:        "multiple fields",
			fields:      []string{"email", "phone"},
			expectedLen: 2,
		},
		{
			name:        "nonexistent field",
			fields:      []string{"nonexistent"},
			expectedLen: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			breaches, err := repo.GetBreachesWithFields(ctx, tt.fields)
			if err != nil {
				t.Errorf("GetBreachesWithFields() error = %v", err)
				return
			}
			if len(breaches) != tt.expectedLen {
				t.Errorf("GetBreachesWithFields() got %d breaches, want %d", len(breaches), tt.expectedLen)
			}
		})
	}
}

func TestMockBreachRepository_FindExactMatches(t *testing.T) {
	repo := NewMockBreachRepository()
	ctx := context.Background()

	tests := []struct {
		name           string
		breachName     string
		fieldHashes    map[string]string
		expectedLen    int
		expectedFields []string
	}{
		{
			name:       "matching email",
			breachName: "breach_linkedin_2021",
			fieldHashes: map[string]string{
				"email": "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
			},
			expectedLen:    1,
			expectedFields: []string{"email"},
		},
		{
			name:       "multiple matching fields",
			breachName: "breach_linkedin_2021",
			fieldHashes: map[string]string{
				"email":     "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
				"firstName": "f1e2d3c4b5a6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
			},
			expectedLen:    2,
			expectedFields: []string{"email", "firstName"},
		},
		{
			name:       "non-matching hash",
			breachName: "breach_linkedin_2021",
			fieldHashes: map[string]string{
				"email": "wronghash123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
			},
			expectedLen:    0,
			expectedFields: []string{},
		},
		{
			name:       "nonexistent breach",
			breachName: "nonexistent_breach",
			fieldHashes: map[string]string{
				"email": "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
			},
			expectedLen:    0,
			expectedFields: []string{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			matches, err := repo.FindExactMatches(ctx, tt.breachName, tt.fieldHashes)
			if err != nil {
				t.Errorf("FindExactMatches() error = %v", err)
				return
			}
			if len(matches) != tt.expectedLen {
				t.Errorf("FindExactMatches() got %d matches, want %d", len(matches), tt.expectedLen)
			}

			for _, expectedField := range tt.expectedFields {
				found := false
				for _, match := range matches {
					if match == expectedField {
						found = true
						break
					}
				}
				if !found {
					t.Errorf("FindExactMatches() missing expected field %s", expectedField)
				}
			}
		})
	}
}

func TestMockBreachRepository_FindSensitiveMatches(t *testing.T) {
	repo := NewMockBreachRepository()
	ctx := context.Background()

	tests := []struct {
		name             string
		fieldType        string
		partialHash      string
		expectedLen      int
		shouldHaveBreach string
	}{
		{
			name:             "matching password prefix",
			fieldType:        "password",
			partialHash:      "a1b2c3d4",
			expectedLen:      1,
			shouldHaveBreach: "breach_passwords_2020",
		},
		{
			name:             "non-matching prefix",
			fieldType:        "password",
			partialHash:      "xxxxxxxx",
			expectedLen:      0,
			shouldHaveBreach: "",
		},
		{
			name:             "nonexistent field type",
			fieldType:        "nonexistent",
			partialHash:      "a1b2c3d4",
			expectedLen:      0,
			shouldHaveBreach: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			matches, err := repo.FindSensitiveMatches(ctx, tt.fieldType, tt.partialHash)
			if err != nil {
				t.Errorf("FindSensitiveMatches() error = %v", err)
				return
			}
			if len(matches) != tt.expectedLen {
				t.Errorf("FindSensitiveMatches() got %d breaches, want %d", len(matches), tt.expectedLen)
			}

			if tt.shouldHaveBreach != "" {
				if _, exists := matches[tt.shouldHaveBreach]; !exists {
					t.Errorf("FindSensitiveMatches() missing expected breach %s", tt.shouldHaveBreach)
				}
			}
		})
	}
}

func TestMockBreachRepository_GetBreachMetadata(t *testing.T) {
	repo := NewMockBreachRepository()
	ctx := context.Background()

	tests := []struct {
		name            string
		breachName      string
		shouldError     bool
		expectedRecords int64
	}{
		{
			name:            "existing breach",
			breachName:      "breach_linkedin_2021",
			shouldError:     false,
			expectedRecords: 700000000,
		},
		{
			name:            "nonexistent breach",
			breachName:      "nonexistent_breach",
			shouldError:     true,
			expectedRecords: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			metadata, err := repo.GetBreachMetadata(ctx, tt.breachName)

			if tt.shouldError {
				if err == nil {
					t.Errorf("GetBreachMetadata() expected error but got none")
				}
				return
			}

			if err != nil {
				t.Errorf("GetBreachMetadata() error = %v", err)
				return
			}

			if metadata.AffectedRecords != tt.expectedRecords {
				t.Errorf("GetBreachMetadata() got %d records, want %d", metadata.AffectedRecords, tt.expectedRecords)
			}
		})
	}
}

// ======================================
// BENCHMARK TESTS
// ======================================

func BenchmarkMockRepository_GetBreachesWithFields(b *testing.B) {
	repo := NewMockBreachRepository()
	ctx := context.Background()
	fields := []string{"email", "firstName"}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := repo.GetBreachesWithFields(ctx, fields)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkMockRepository_FindExactMatches(b *testing.B) {
	repo := NewMockBreachRepository()
	ctx := context.Background()
	fieldHashes := map[string]string{
		"email":     "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
		"firstName": "f1e2d3c4b5a6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := repo.FindExactMatches(ctx, "breach_linkedin_2021", fieldHashes)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkMockRepository_FindSensitiveMatches(b *testing.B) {
	repo := NewMockBreachRepository()
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := repo.FindSensitiveMatches(ctx, "password", "a1b2c3d4")
		if err != nil {
			b.Fatal(err)
		}
	}
}

// ======================================
// INTEGRATION TESTS
// ======================================

func TestRepositoryIntegration(t *testing.T) {
	repo := NewMockBreachRepository()
	ctx := context.Background()

	t.Run("full search workflow", func(t *testing.T) {
		fieldNames := []string{"email", "firstName"}
		breaches, err := repo.GetBreachesWithFields(ctx, fieldNames)
		if err != nil {
			t.Fatal(err)
		}

		if len(breaches) == 0 {
			t.Fatal("expected at least one breach")
		}

		fieldHashes := map[string]string{
			"email":     "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
			"firstName": "f1e2d3c4b5a6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
		}

		for _, breach := range breaches {
			matches, err := repo.FindExactMatches(ctx, breach.Name, fieldHashes)
			if err != nil {
				t.Errorf("FindExactMatches failed for breach %s: %v", breach.Name, err)
			}

			t.Logf("Breach %s: found %d matches", breach.Name, len(matches))
		}
	})

	t.Run("sensitive data workflow", func(t *testing.T) {
		partialHash := "a1b2c3d4"
		matches, err := repo.FindSensitiveMatches(ctx, "password", partialHash)
		if err != nil {
			t.Fatal(err)
		}

		for breachSource, hashes := range matches {
			metadata, err := repo.GetBreachMetadata(ctx, breachSource)
			if err != nil {
				t.Errorf("GetBreachMetadata failed for %s: %v", breachSource, err)
				continue
			}

			t.Logf("Breach %s (%s): found %d candidate hashes",
				breachSource, metadata.Date.Format("2006-01-02"), len(hashes))
		}
	})
}
