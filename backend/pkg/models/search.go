package models

type NormalSearchRequest struct {
	Fields map[string]string
}

type NormalSearchResponse struct {
	Matches []BreachMatch
}

type SensitiveSearchRequest struct {
	Field string `json:"field"`
	Hash  string `json:"hash"`
}

type SensitiveSearchResponse struct {
	PotentialPasswords map[string]*NormalSearchResponse
}
