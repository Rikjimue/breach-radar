package models

import (
	"time"
)

type BreachMetadata struct {
	ID          uint64    `json:"id" db:"breach_id"`
	Name        string    `json:"name" db:"table_name"`
	Date        time.Time `json:"date" db:"breach_date"`
	Description string    `json:"description" db:"breach_description"`
	Severity    string    `json:"severity" db:"breach_serverity"`
	Fields      []string  `json:"fields" db:"breach_data"`
	Link        string    `json:"link" db:"breach_link"`
}

type BreachMatch struct {
	ID          uint64            `json:"id" db:"breach_id"`
	Name        string            `json:"name" db:"table_name"`
	Date        time.Time         `json:"date" db:"breach_date"`
	Description string            `json:"description" db:"breach_description"`
	Severity    string            `json:"severity" db:"breach_serverity"`
	Fields      map[string]string `json:"fields" db:"breach_data"`
	Link        string            `json:"link" db:"breach_link"`
}

type SensitiveTables struct {
	Field      string
	TableNames []string
}
