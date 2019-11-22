package todo

//Todo model
type Todo struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	DataH     string `json:"data"`
	UserID    string `json:"userid"`
	Completed bool   `json:"completed"`
}
