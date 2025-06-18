package models

import (
	"time"
)

type ExactMatch struct {
	Name            string   `json:"name"`
	Date            string   `json:"date"`
	AffectedRecords string   `json:"affectedRecords"`
	MatchedFields   []string `json:"matchedFields"`
	PartialMatch    bool     `json:"partialMatch"`
}

type BreachCandidate struct {
	Name            string              `json:"name"`
	Date            string              `json:"date"`
	AffectedRecords string              `json:"affectedRecords"`
	HashCandidates  map[string][]string `json:"hashCandidates"`
	PartialMatch    bool                `json:"partialMatch"`
}

type BreachMetadata struct {
	ID              uint64    `json:"id" db:"id"`
	Name            string    `json:"name" db:"name"`
	DisplayName     string    `json:"displayName" db:"display_name"`
	Date            time.Time `json:"date" db:"breach_date"`
	AffectedRecords int64     `json:"affectedRecords" db:"affected_records"`
	Fields          []string  `json:"fields" db:"fields"`
	SourceURL       string    `json:"sourceUrl" db:"source_url"`
	Industry        string    `json:"industry" db:"industry"`
}

type SensitiveTables struct {
	Field      string
	TableNames []string
}
