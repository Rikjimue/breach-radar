package models

type BreachSearchRequest struct {
	Mode   string            `json:"mode"` // "personal" or "sensitive"
	Fields map[string]string `json:"fields"`
}

type PersonalSearchResponse struct {
	ExactMatches []ExactMatch `json:"exactMatches"`
	SearchFields []string     `json:"searchFields"`
}

type SensitiveSearchResponse struct {
	CandidateBreaches []BreachCandidate `json:"candidateBreaches"`
	SearchFields      []string          `json:"searchFields"`
}
