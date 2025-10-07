pipeline {
    agent any

    environment {
        // Set Node.js version if using nvm
        NODE_VERSION = '16' // Replace with your Node.js version
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    // Install Node.js if required
                    sh 'node --version || nvm install $NODE_VERSION'
                }
                // Install dependencies
                sh 'npm install'
            }
        }

        stage('Install Allure CLI') {
            steps {
                sh 'npm install -D allure-commandline'
            }
        }

        stage('Run Tests') {
            steps {
                // Run Playwright tests
                sh 'npx playwright test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                // Generate Allure report
                sh 'npx allure generate allure-results --clean -o allure-report'
            }
        }

        stage('Archive Allure Report') {
            steps {
                // Archive the Allure report for Jenkins
                archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            }
        }

        stage('Publish Allure Report') {
            steps {
                // Publish the Allure report using the Allure Jenkins plugin
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            // Clean up workspace after the build
            cleanWs()
        }
    }
}