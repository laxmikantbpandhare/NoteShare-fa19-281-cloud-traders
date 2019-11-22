package todo

import (
	"encoding/json"
	"log"

	"../event"
	"../fsstore"
	"../models"
	"os"		
	"fmt"		
	//"../middleware"
	uuid "github.com/satori/go.uuid"
	"github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/aws/session"
    "github.com/aws/aws-sdk-go/service/s3/s3manager"
    //"github.com/minio/minio-go"
    //"github.com/aws/aws-sdk-go/aws/credentials"
    "path/filepath"
)

//Projection the todo projection which creates todo views
type Projection struct {
	subscription *event.Subscription
	datastore    fsstore.FSStore
}

//NewProjection creates a new Projection
func NewProjection(bus event.Bus) *Projection {
	datastore, err := fsstore.NewJSONFSStore("todo")
	if err != nil {
		panic(err)
	}
	p := &Projection{
		subscription: bus.Subscribe(
			"TodoProjection",
			eventTodoItemCreated,
			eventTodoItemRemoved,
			eventTodoItemUpdated,
		),
		datastore: datastore,
	}

	go p.start()

	return p
}

//HandleEvent handles events this projection subscribes to
func (p *Projection) HandleEvent(event *models.EventMessage) {
	switch event.Name {
	case eventTodoItemUpdated:
		fallthrough
	case eventTodoItemCreated:
		p.handleTodoItemCreatedEvent(event)
	case eventTodoItemRemoved:
		p.handleTodoItemRemovedEvent(event)
	}
}

func (p *Projection) handleTodoItemCreatedEvent(event *models.EventMessage) {
	//todo := new(Todo)
	todo := new(models.Tweet)
	//	err := json.Unmarshal(*event.Data, todo)

	json.Unmarshal(*event.Data, todo)

	log.Println("event data.", &event)

	// if err != nil {
	// 	panic(err)
	// }

	uuid, _ := uuid.NewV4()
	todo.ID = uuid.String()

	log.Println("tweet data.", todo)
	log.Println("tweet dataName.", todo.Name)
	log.Println("tweet dataH.", todo.Data)
	log.Println("tweet dataH.", todo.Userid)
	p.datastore.Set(todo.ID, todo)
	p.datastore.AddToCollection("all", todo.ID, todo)
	var allFile string
	allFile=filepath.Join(p.datastore.GetDataDir(),"all.json")
	AddFileToS3(allFile)
	// p.datastore.Set("xyz", todo)
	// p.datastore.AddToCollection("all", "xyz", todo)
}

func (p *Projection) handleTodoItemRemovedEvent(event *models.EventMessage) {
	var id string
	err := json.Unmarshal(*event.Data, &id)
	if err != nil {
		log.Panic(err)
	}
	p.datastore.Remove(id)
	p.datastore.RemoveFromCollection("all", id)
}

func (p *Projection) start() {
	for {
		select {
		case event := <-p.subscription.EventChan:
			go p.HandleEvent(event)
		}
	}
}


func AddFileToS3(fileDir string) {
	
    // Open the file for use
    file, err := os.Open(fileDir)
	if err != nil {
		fmt.Println("Failed to open file", fileDir, err)
		os.Exit(1)
	}
	defer file.Close()

	 sess, err := session.NewSession(&aws.Config{
        Region: aws.String("us-east-1")},
    )


	svc := s3manager.NewUploader(sess)

	fmt.Println("Uploading file to S3...")

	svc.Upload(&s3manager.UploadInput{
		Bucket: aws.String("noteshare-cmpe281"),
		Key:    aws.String("all.json"),
		Body:   file,
		ACL: 	aws.String("public-read-write"),
	})

	// if err != nil {
	// 	fmt.Println("error", err)
	// 	os.Exit(1)
	// }
	fmt.Println("Successfully uploaded file to S3")

	//fmt.Printf("Successfully uploaded %s to %s\n", fileDir, result.Location)
}
