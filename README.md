# Team Hackathon Project




## System Architecture Diagram
![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/SystemArchitectureDiagram.png)

## Jenkins Pipeline 

## Kubernetes 

## CQRS (Command Query Responsibility Segregation)
The NoteShare application has been split into one part that handles all the writing and one that handles all the reading. This is usually done through Command and Query messages/objects.

The rationale of doing the segregation is that for many problems having the same conceptual model for commands and queries leads to a more complex model that does neither well. So separating the reoteShare application allows us to scale each of the service call independently.
If during exams, the reads of Notes increase we can let more servers handle the read requests.

EventSourcing is persisting the state of the NoteShare application, however instead of just persisting the latest state (way its done in relational database) all state changes that has happened over time to the notes are stored.

Creating Notes:
    1. Client issues a POST  call to “/note/cmd”
    2. API interface receives the request and converts the payload  to a CommandMessage and passes it on to the responsible command handler
    3. The handler creates an event, and then persists it to the eventlog.
    4. The eventbus is then notified of the event and publishes it to all listeners of that type of event.
Reading Notes:
    1. Client issues a GET  call to “/note”
    2. API interface receives the request and handles the event using event handler.
    3. The JSON file for all the notes is read from the s3 bucket and rendered at client side.
    4. User is able to view all the notes.
    
### Comparison with traditional Read/Write in Database vs Event based CQRS
In case of traditional Read/Write to database, the application does a lot of transformation in case of both read and write operations. While in case of Event based CQRS application, the read happens in extremely fast manner. The split architecture allows non-blocking read and write.

### Challenges/Concerns
Adding CQRS to a domain that doesn’t have much difference between read and write, increases the complexity of the application and the events handling a little tedious.
