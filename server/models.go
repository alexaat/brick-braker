package main

type Response struct {
	Page       int          `json:"page"`
	IsLastPage bool         `json:"is_last_page"`
	Total      int          `json:"total"`
	Payload    *[]ScoreItem `json:"payload"`
}
type ScoreItem struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  int    `json:"time"`
}
type Status struct {
	Message string `json:"message"`
}
type Rank struct {
	Rank int `json:"rank"`
}
