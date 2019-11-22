package middleware

import (
	"fmt"
	"log"

	"../models"
)

//CommandFunc is the handler of a given command message
type CommandFunc func(*models.CommandMessage, chan<- *models.EventMessage) error

//CommandHandler is the interface which handles commands
type CommandHandler interface {
	RegisterCommand(string, ...CommandFunc) error
	HandleCommandMessage(*models.CommandMessage) error
	Start()
}

//DefaultCommandHandler a default command handler implementation
type DefaultCommandHandler struct {
	commands  map[string][]CommandFunc
	eventChan chan *models.EventMessage
}

//RegisterCommand binds a command with a handler function
func (d *DefaultCommandHandler) RegisterCommand(cmd string, handlers ...CommandFunc) error {
	if _, exists := d.commands[cmd]; exists {
		return fmt.Errorf("Command: %s already exists", cmd)
	}
	d.commands[cmd] = handlers
	return nil
}

//HandleCommandMessage handles a common.CommandMessage and passes it along to the registered handler
func (d *DefaultCommandHandler) HandleCommandMessage(message *models.CommandMessage) error {
	//message.Name = "createTodoItem"
	log.Printf("Received command: %s", message.Name)
	if handlers, exists := d.commands[message.Name]; exists {
		var err error
		log.Printf("Received Message: %v", message)
		for _, handler := range handlers {
			err = handler(message, d.eventChan)
			if err != nil {
				break
			}
		}
		return err
	}
	return fmt.Errorf("No such command %s", message.Name)
}

//Start starts listening to the eventChan
func (d *DefaultCommandHandler) Start() {
	for {
		select {
		case event := <-d.eventChan:
			eventRepository.Write(event)
		}
	}
}

//NewDefaultCommandHandler returns a new DefaultCommandHandler
func NewDefaultCommandHandler() *DefaultCommandHandler {
	return &DefaultCommandHandler{
		commands:  make(map[string][]CommandFunc),
		eventChan: make(chan *models.EventMessage),
	}
}
