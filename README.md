# NoteShare

The whole process of missing class, trying to get notes from classmates by going through their notebook, finding the right notes then taking pictures is frustrating and unreliable. Most times professors only post a segment of what they do in class, and those additional notes are hard to acquire. This is a solution to bring students who might not necessarily know each other together on a single widget platform to share important notes that would be relevant to the class. 

NoteShare was developed for brainstorming, project tracking, story writing, outlining and other collaborative efforts from students and teachers, scientists and researchers, creative artists and others. The software lets you create content that includes text, live Web pages, sketches, file attachments and other material.

## Members 
   | Name                           | SJSU ID    |
   |--------------------------------|------------|
   | **Laxmikant Bhaskar Pandhare** | 013859989  |
   | **Prachi Chouksey**            | 013828945  |
   | **Ruchika Hazariwal**          | 013728923  |
   | **Sai Manvith**                | 013848211  |
   | **Suyash Srivastava**          | 013591474  |

## Modules 

| Name       | Who            |
|------------|----------------|
|Users       | Ruchika        |
|Notes       | Sai            |
|Profile     | Laxmikant      |
|Search      | Prachi         |
|Follow      | Suyash         |




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
