node {  
    stage('Pull from Github') { 
        // 
        // git 'https://github.com/manvithis/CICD_test'
    }
    stage('Run DockerFile') { 
        // 
     sh "docker build -t 5467438/my-app:${env.BUILD_NUMBER} ."
    }
    stage('Push Docker Image'){
     // some block
    withCredentials([string(credentialsId: 'docker-pwd', variable: 'dockerHubPwd')]) {
    sh "docker login -u 5467438 -p ${dockerHubPwd}"
    }    
     sh "docker push 5467438/my-app:${env.BUILD_NUMBER}"
   }
   stage('Run Container on Dev Server'){
     def dockerRun = 'docker run -p 8080:8080 -d --name my-app kammana/my-app:2.0.0'
     sshagent(['dev-server']) {
       sh "ssh -o StrictHostKeyChecking=no ec2-user@172.31.18.198 ${dockerRun}"
     }
   }
}
