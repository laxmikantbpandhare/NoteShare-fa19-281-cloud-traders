package todo

import (
	"encoding/json"
	"testing"

	//"code.google.com/p/go-uuid/uuid"
	"github.com/satori/go.uuid"
	"../common"
	"../event"
)

func TestCreateTodo(t *testing.T) {
	bus := event.NewDefaultBus()
	projection := NewProjection(bus)
	uuid,_ := uuid.NewV4()
	Id:= uuid.String()
	data, _ := json.Marshal(&Todo{ID: id})
	raw := json.RawMessage(data)
	e := &common.EventMessage{
		Name:    eventTodoItemCreated,
		Data:    &raw,
		Version: 1,
	}
	projection.HandleEvent(e)
}

func TestCreateAndRemoveTodo(t *testing.T) {
	bus := event.NewDefaultBus()
	projection := NewProjection(bus)
	id := uuid.New()
	data, _ := json.Marshal(&Todo{ID: id})
	raw := json.RawMessage(data)
	e := &common.EventMessage{
		Name:    eventTodoItemCreated,
		Data:    &raw,
		Version: 1,
	}
	projection.HandleEvent(e)

	raw = json.RawMessage(id)
	e = &common.EventMessage{
		Name: eventTodoItemRemoved,
		Data: &raw,
	}
}
