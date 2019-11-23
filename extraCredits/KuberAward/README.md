## Kubernetes

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/AWS_Kubernetes_Nodes.png)

![alt text](https://github.com/nguyensjsu/fa19-281-cloud-traders/blob/master/images/Custom_Kuber_Cluster.jpeg)

First understood the basic architecture of kubernetes master its components like kube-ctl, kube-proxy, kubelet.controller-manager, etcd, Api-server, container run time and how services and pods work

#### First Attempt
```
In first deployment we used google kubernetes engine, its has a very simple deployment as google creates service and load balancer on your behalf all you have to do was deploy the docker-image as pods
```

#### Second Attempt
```
<ol>
<li> In second deployment we used Amazon EKS service </li>
<li> As as per documentation we created a ec-2 instance gave it iam role permissions and gave the EKS the k8 permissions </li>
<li> when we trying to connct to kubernetes master via the EC2-instance from our end we were getting error's as it was unable to connect. </li>
<li> So after some Online research we found this wa happening to a lot of people and the reason being the problem with the AmazonAuthentication(aws-iam-configuration API) Services where the token we were getting was null and this prevented us from geeting into kubernetes master </li>
```

#### Third Attempt
```
<li> In third deployment we started building our own kubernetes cluster and in this first we have taken 1 instances </li>
<li> we installed kubernetes, Docker on this node created two more nodes and from the 1st instance ami and now we logged into kubernetes master which is 1st node and installed etcd, changed the config kube-conig </li>
<li> In the worker nodes we changed the kubelet to connect to master node now we created pod.yaml and Deploymentservice.yaml, the Deployment.yaml is config to create and connect to the Network Load-balancer in aws which worked for us </li>
```
#### Conclsuion:
GKE: GKE was the easiest deployment, as it provides load-balancer and Service for us automatically

EKS: EKS has a lot of configuration to make and there were lot of compatibility issues for us and a lot of steps when compared to GKE

Custom Kubernetes: This is the one which has taken most of our time as we had to change a lot of configuartions for it to work properly and the main challeges we faced is the attachement of nlb to the service
