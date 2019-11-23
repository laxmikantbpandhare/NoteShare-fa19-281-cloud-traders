node { 
    try {
    stage('Pull_from_Github') { 
        checkout scm
	slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
	slackSend color: 'good', message: "commited on branch : ${env.BRANCH_NAME}"
	  
    }	
    stage('Running unit tests')
    { 
		slackSend color: '#FFFF00', message: "Starting unit test cases" 
	   	sh " bash goshell.sh"
		slackSend color: 'good', message: "All the unit Test cases were Passing"   
	  
    }

    stage('Building_DockerFile') { 
	slackSend color: '#FFFF00', message: "Building Docker-File"
	sh "chmod 755 server"    
        sh "docker build -t 5467438/cloud_user:${env.BUILD_NUMBER} ."
    
    }
    stage ("wait_docker_run") {
         echo 'Waiting 5 sec before running Docker image'
         sleep 5 
    }
   stage('Push_Docker_Image'){
	slackSend color: 'good', message: "Pushing the image into5467438/cloud_user:${env.BUILD_NUMBER}"
        withCredentials([string(credentialsId: 'docker-pwd', variable: 'dockerHubPwd')]) {
        sh "docker login -u 5467438 -p ${dockerHubPwd}"
        }    
        sh "docker push 5467438/cloud_user:${env.BUILD_NUMBER}"
   }
   stage ("wait_docker_run") {
         echo 'Waiting 20 sec before running Docker image'
         sleep 20 
        withCredentials([string(credentialsId: 'docker-pwd', variable: 'dockerHubPwd')]) {
        sh "docker login -u 5467438 -p ${dockerHubPwd}"
        }    
         sh "docker run --name docker${env.BUILD_NUMBER} -td -p 9004:8080 5467438/cloud_user:${env.BUILD_NUMBER}"
	   slackSend color: 'good', message: "Started running Docker container" 
    }
    stage('Testing') {
	 slackSend color: '#FFFF00', message: "Running Api-tests"  
	 sh "chmod +x ./runtest.sh" 
         sh "./runtest.sh"
	 slackSend color: 'good', message: "All Test cases passed"  
	    
	    
    }    
    stage('Remove Previous Container'){

		def dockerRm = 'bash /home/centos/docker-cleaner.sh'
	        try{
		sshagent(['ruchika_2']) {
			sh "ssh -o StrictHostKeyChecking=no centos@3.208.117.50 ${dockerRm}"
		}
		}catch(error){
		//  do nothing if there is an exception
		      slackSend color: 'red', message: "No Containers to remove or error" 
	      }
			
	
     }

	stage ('Dev-server-test')
     {
	        slackSend color: '#FFFF00', message: "No Containers to remove or error" 
	        def dockerRun = "docker run --name dockerz -itd -p 9004:8080 5467438/cloud_user:${env.BUILD_NUMBER}"
		sshagent(['ruchika_2']) {
    			// some block
			sh "ssh -o StrictHostKeyChecking=no centos@3.208.117.50 ${dockerRun}"     
	 }
	       slackSend color: 'good', message: "Container Deployed on Instance" 
      }
      } 
      finally {
		sh 'docker container stop $(docker container ls -aq)'
		sh 'docker container rm $(docker container ls -aq)'
		deleteDir()
            }
	
}
