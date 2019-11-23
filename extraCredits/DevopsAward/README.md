## Jenkins Pipeline

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/CI_CD_Pipeline.png)

First we created a docker image of jenkins but didn't work as expected as there are lot of configuratio and compatibility issues as it was running on docker.
<ol>
<li> Next we have taken an EC2-instance and made it a Jenkins-server by installing Java, Jenkins by default the jenkins was running  on port 8080 logged into Jenkins as admin and by installing the custom plugins .</li>
<li> Installed plugins like SSHAgent, Slack notification, Docker in global plugin tab which are required for the project \
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
