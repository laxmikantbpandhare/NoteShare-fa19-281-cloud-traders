package todo

import (
	"encoding/json"

	//"code.google.com/p/go-uuid/uuid"
	"../models"
	uuid "github.com/satori/go.uuid"

	"log"
)

const (
	eventTodoItemCreated = "todoItemCreated"
	eventTodoItemRemoved = "todoItemRemoved"
	eventTodoItemUpdated = "todoItemUpdated"
)

//CreateTodoItem creates a todo based on a command message
func CreateTodoItem(cmd *models.CommandMessage, eventChan chan<- *models.EventMessage) error {
	var todo Todo

	log.Println("Readinsasdg the event log...")
	log.Println(cmd)
	// if err := json.Unmarshal(*cmd.Data, &todo); err != nil {
	// 	return err
	// }
	uuid, _ := uuid.NewV4()
	todo.ID = uuid.String()
	log.Println("Readissnsasdg the event log...")
	data, err := json.Marshal(&cmd)
	log.Println(&cmd)
	if err != nil {
		return err
	}

	log.Println("marshal the event log...", data)
	raw := json.RawMessage(data)
	log.Println("raw the event log...", raw)
	event := &models.EventMessage{
		Name: eventTodoItemCreated,
		Data: &raw,
	}
	eventChan <- event
	return nil
}

//RemoveTodoItem removes a todo based on a command message
func RemoveTodoItem(cmd *models.CommandMessage, eventChan chan<- *models.EventMessage) error {
	event := &models.EventMessage{
		Name: eventTodoItemRemoved,
		Data: cmd.Data,
	}
	eventChan <- event
	return nil
}

//UpdateTodoItem updates a todo based on a command message
func UpdateTodoItem(cmd *models.CommandMessage, eventChan chan<- *models.EventMessage) error {
	event := &models.EventMessage{
		Name: eventTodoItemUpdated,
		Data: cmd.Data,
	}
	eventChan <- event
	return nil
}
