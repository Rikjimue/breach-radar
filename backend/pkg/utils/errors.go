package utils

type AppError struct {
	Message string
	Code    int
}

func (e *AppError) Error() string {
	return e.Message
}
