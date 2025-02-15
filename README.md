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

| API        | Who            |
|------------|----------------|
|Users       | Ruchika        |
|Notes       | Sai            |
|Profile     | Laxmikant      |
|Search      | Prachi         |
|Follow      | Suyash         |


## System Architecture Diagram
![alt text](https://github.com/laxmikantbpandhare/NoteShare-fa19-281-cloud-traders/tree/master/images)

## Jenkins Pipeline

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/CI_CD_Pipeline.png)


![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/CICD_Slack.png)

First we created a docker image of jenkins but didn't work as expected as there are lot of configuratio and compatibility issues as it was running on docker.
<ol>
<li> Next we have taken an EC2-instance and made it a Jenkins-server by installing Java, Jenkins by default the jenkins was running  on port 8080 logged into Jenkins as admin and by installing the custom plugins .</li>
<li> Installed plugins like SSHAgent, Slack notification, Docker in global plugin tab which are required for the project.
<li> Next created a new Multi-Brach pipeline in the jenkins for which we connected to our Github project. </li>
<li> Wrote pipeline script in JenkinsPipeline. </li>
<li> Launched web-hooks from Github to the JenkinsServer so that when ever a push comes the pipeline will start automatically.
<li> Jenkins does the unit-Testing and if the test cases are passing it will create a docker image and push it into Docker-hub
   and now the pushed image is downloaded and a container is created. </li>
<li> Api(new-man) test are ran on the container and if the test cases passes then the images are deployed into the Pre-built        EC2-instances. </li>
<li> Slack notifications are sent on every stage. </li>
</ol>

 #### Jenkins to Custom-kubernetes-cluster
<ol>
<li>  The same steps are followed as above till step 6 </li> 
<li>  The pod.yaml and service.yaml files are then deployed which has latest pod versioning to the Kube-master where they are        created using shell commands from jenkins </li> 
 </ol>
  

## Kubernetes

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/AWS_Kubernetes_Nodes.png)

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/Custom_Kuber_Cluster.jpeg)

First understood the basic architecture of kubernetes master its components like kube-ctl, kube-proxy, kubelet.controller-manager, etcd, Api-server, container run time and how services and pods work

#### First Attempt

In first deployment we used google kubernetes engine, its has a very simple deployment as google creates service and load balancer on your behalf all you have to do was deploy the docker-image as pods


#### Second Attempt

<ol>
<li> In second deployment we used Amazon EKS service </li>
<li> As as per documentation we created a ec-2 instance gave it iam role permissions and gave the EKS the k8 permissions </li>
<li> when we trying to connct to kubernetes master via the EC2-instance from our end we were getting error's as it was unable to connect. </li>
<li> So after some Online research we found this wa happening to a lot of people and the reason being the problem with the AmazonAuthentication(aws-iam-configuration API) Services where the token we were getting was null and this prevented us from geeting into kubernetes master </li>


#### Third Attempt

<li> In third deployment we started building our own kubernetes cluster and in this first we have taken 1 instances </li>
<li> we installed kubernetes, Docker on this node created two more nodes and from the 1st instance ami and now we logged into kubernetes master which is 1st node and installed etcd, changed the config kube-conig </li>
<li> In the worker nodes we changed the kubelet to connect to master node now we created pod.yaml and Deploymentservice.yaml, the Deployment.yaml is config to create and connect to the Network Load-balancer in aws which worked for us </li>

#### Conclsuion:
GKE: GKE was the easiest deployment, as it provides load-balancer and Service for us automatically

EKS: EKS has a lot of configuration to make and there were lot of compatibility issues for us and a lot of steps when compared to GKE

Custom Kubernetes: This is the one which has taken most of our time as we had to change a lot of configuartions for it to work properly and the main challeges we faced is the attachement of nlb to the service

## CQRS (Command Query Responsibility Segregation)

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/CQRS_Architecture.png)

The NoteShare application has been split into one part that handles all the writing and one that handles all the reading. This is usually done through Command and Query messages/objects.

The rationale of doing the segregation is that for many problems having the same conceptual model for commands and queries leads to a more complex model that does neither well. So separating the reoteShare application allows us to scale each of the service call independently.
If during exams, the reads of Notes increase we can let more servers handle the read requests.

EventSourcing is persisting the state of the NoteShare application, however instead of just persisting the latest state (way its done in relational database) all state changes that has happened over time to the notes are stored.

Creating Notes:
<ol>
   <li> Client issues a POST  call to “/note/cmd” </li>
   <li>API interface receives the request and converts the payload  to a CommandMessage and passes it on to the responsible command handler </li>
   <li>The handler creates an event, and then persists it to the eventlog. </li>
   <li> The eventbus is then notified of the event and publishes it to all listeners of that type of event. </li>
</ol>

Reading Notes:
<ol>
   <li> Client issues a GET  call to “/note” </li>
   <li> API interface receives the request and handles the event using event handler. </li>
   <li> The JSON file for all the notes is read from the s3 bucket and rendered at client side. </li>
   <li> User is able to view all the notes. </li>
  </ol>
    
### Comparison with traditional Read/Write in Database vs Event based CQRS
In case of traditional Read/Write to database, the application does a lot of transformation in case of both read and write operations. While in case of Event based CQRS application, the read happens in extremely fast manner. The split architecture allows non-blocking read and write.

### Challenges/Concerns
Adding CQRS to a domain that doesn’t have much difference between read and write, increases the complexity of the application and the events handling a little tedious.

## Grafana

As we have more than 20 instances for our project, metric watch became hectic as we have to switch between different instances and accounts so in order to overcome this we used grafana which was deployed on Centos instance using Docker . Grafana helped us to aggregate all the metrics at one place.

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/Grafana-Dashboard.png)

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/Grafana-Instances.png)

## Application Dashboard
A glimpse of the application

### Signup

![alt text](https://github.com/laxmikantbpandhare/fa19-281-cloud-traders/blob/master/images/signup.png)

### Login

![alt text](https://github.com/laxmikantbpandhare/fa19-281-cloud-traders/blob/master/images/login.png)

### Notes View

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/NoteShare-Home.png)

### Notes

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/NoteShare-CreateNote.png)

### Edit Profile Before

![alt text](https://github.com/laxmikantbpandhare/fa19-281-cloud-traders/blob/master/images/edit%20Profile%20Before.png)

### Edit Profile After

![alt text](https://github.com/laxmikantbpandhare/fa19-281-cloud-traders/blob/master/images/edit%20Profile%20After.png)

### View Other's Notes

![alt text](https://github.com/laxmikantbpandhare/fa19-281-cloud-traders/blob/master/images/view%20others%20notes.png)


### Search

![alt text](https://github.com/laxmikantbpandhare/fa19-281-cloud-traders/blob/master/images/search.png)

### follow and unfollow

![alt text](https://github.com/laxmikantbpandhare/fa19-281-cloud-traders/blob/master/images/follow%20unfollow.png)

