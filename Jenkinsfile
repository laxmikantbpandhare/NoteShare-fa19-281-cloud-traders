node { 
    try {
    stage('Pull_from_Github') { 
        checkout scm
	slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
	slackSend color: 'good', message: "commited on branch : ${env.BRANCH_NAME}"
	  
    }	
    

    stage('Building_DockerFile') { 
	slackSend color: '#FFFF00', message: "Building Docker-File"
	sh "chmod 755 server"    
        sh "docker build -t 5467438/my-app:${env.BUILD_NUMBER} ."
    
    }
    stage ("wait_docker_run") {
         echo 'Waiting 5 sec before running Docker image'
         sleep 5 
    }
   stage('Push_Docker_Image'){
	slackSend color: 'good', message: "Pushing the image into5467438/my-app:${env.BUILD_NUMBER}"
        withCredentials([string(credentialsId: 'docker-pwd', variable: 'dockerHubPwd')]) {
        sh "docker login -u 5467438 -p ${dockerHubPwd}"
        }    
        sh "docker push 5467438/my-app:${env.BUILD_NUMBER}"
   }
        
    stage('Remove Previous Container'){

		def dockerRm = 'bash /home/centos/docker-cleaner.sh'
	        try{
		sshagent(['Dev-server-test']) {
			sh "ssh -o StrictHostKeyChecking=no centos@3.234.209.140 ${dockerRm}"
		}
		}catch(error){
		//  do nothing if there is an exception
		      slackSend color: 'red', message: "No Containers to remove or error" 
	      }
			
	
     }
	    stage ('Permission')
     {
	        slackSend color: '#FFFF00', message: "No Containers to remove or error" 
	        def dockerPermission = "sudo chmod 777 /var/run/docker.sock"
		sshagent(['Dev-server-test']) {
    			// some block
			sh "ssh -o StrictHostKeyChecking=no centos@3.214.208.55 ${dockerPermission}"     
	 }
     }

	stage ('Dev-server-test')
     {
	        slackSend color: '#FFFF00', message: "No Containers to remove or error" 
	        def dockerRun = "docker run --name dockerz -itd -p 9002:8080 5467438/my-app:${env.BUILD_NUMBER}"
		sshagent(['Dev-server-test']) {
    			// some block
			sh "ssh -o StrictHostKeyChecking=no centos@3.214.208.55 ${dockerRun}"     
	 }
	       slackSend color: 'good', message: "Follow ${env.BRANCH_NAME} Container Deployed on Instance on Port 9002" 
      }
      } 
      finally {
		sh 'docker container stop $(docker container ls -aq)'
		sh 'docker container rm $(docker container ls -aq)'
		deleteDir()
            }
	
}
