node { 
    
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
   	 stage ('HTML_REPORT')
     {
	publishHTML([allowMissing: false, 
		     alwaysLinkToLastBuild: false,
		     keepAll: true, 
		     reportDir: '/var/lib/jenkins/workspace/html_report/', 
		     reportFiles: 'index.html', 
		     reportName: 'HTML Report', 
		     reportTitles: ''])	

    }
	stage('cleaning') 
    {
		sh 'docker container stop $(docker container ls -aq)'
		sh 'docker container rm $(docker container ls -aq)'
		deleteDir()
     }
	stage ('Dev-server-test')
     {
		def docker_command ="docker run --name docker${env.BUILD_NUMBER} -itd -p 8089:8080 5467438/my-app:${env.BUILD_NUMBER}"
		sshagent(['Dev-server-test']) {
    			// some block
			sh "ssh -o StrictHostKeyChecking=no centos@3.234.209.140 ${docker_command}"
		}
		
	}
	
}
