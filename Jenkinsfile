node { 
    try {
    stage('Pull_from_Github') { 
        checkout scm
	slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
	slackSend color: 'good', message: "commited on branch : ${env.BRANCH_NAME}"
	  
    }	
    stage('Running unit tests')
    { 
		slackSend color: 'good', message: "Starting unit test cases" 
	   	sh " bash goshell.sh"
		slackSend color: 'good', message: "All the unit Test cases were Passing"   
	  
    }

    stage('Building_DockerFile') { 
	slackSend color: 'good', message: "Building Docker-File"
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
   stage ("wait_docker_run") {
         echo 'Waiting 20 sec before running Docker image'
         sleep 20 
        withCredentials([string(credentialsId: 'docker-pwd', variable: 'dockerHubPwd')]) {
        sh "docker login -u 5467438 -p ${dockerHubPwd}"
        }    
         sh "docker run --name docker${env.BUILD_NUMBER} -td -p 8089:8080 5467438/my-app:${env.BUILD_NUMBER}"
	   slackSend color: 'good', message: "Started running Docker container" 
    }
    stage('Testing') {
	 slackSend color: 'good', message: "Running Api-tests"  
	 sh "chmod +x ./runtest.sh" 
         sh "./runtest.sh"
	 
    }
    stage('Remove Previous Container'){

		def dockerRm = 'bash /home/centos/docker-cleaner.sh'
	        try{
		sshagent(['Dev-server-test']) {
			sh "ssh -o StrictHostKeyChecking=no centos@3.234.209.140 ${dockerRm}"
		}
		}catch(error){
		//  do nothing if there is an exception
		      slackSend color: 'bad', message: "No Containers to remove or error" 
	      }
			
	
     }

	stage ('Dev-server-test')
     {
	        def dockerRun = "docker run --name dockerz -itd -p 8089:8080 5467438/my-app:${env.BUILD_NUMBER}"
		sshagent(['Dev-server-test']) {
    			// some block
			sh "ssh -o StrictHostKeyChecking=no centos@3.234.209.140 ${dockerRun}"     
	 }
	     
      }
      } 
      finally {
		sh 'docker container stop $(docker container ls -aq)'
		sh 'docker container rm $(docker container ls -aq)'
		deleteDir()
            }
	
}
