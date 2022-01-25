#!/usr/bin/env groovy

pipeline {
    agent { label 'docker' }
    environment {
        VERSION = sh(
            returnStdout: true,
            script: 'git describe --dirty=+ --tags'
        ).trim()
        REPO = 'harbor.uio.no'
        PROJECT = 'it-usit-int-drift'
        APP_NAME = 'valg-frontend'
        CONTAINER = "${REPO}/${PROJECT}/${APP_NAME}"
        IMAGE_TAG = "${CONTAINER}:${BRANCH_NAME}-${VERSION}"
    }
    stages {
        stage('Lint, test and build') {
            agent {
                docker {
                    image 'harbor.uio.no/library/docker.io-node:latest'
                    alwaysPull true
                    reuseNode true
                }
            }
            environment {
                HOME = '.'
                // Enable building in node 17.. Bug in webpack.
                NODE_OPTIONS = ' --openssl-legacy-provider'
            }
            stages {
                stage("Install") {
                    steps {
                        sh 'npm config set proxy http://software-proxy.uio.no:3128'
                        sh 'npm config set https-proxy http://software-proxy.uio.no:3128'
                        sh 'npm ci'
                    }
                }
                stage("Test and lint"){
                    parallel {
                        stage('Linting') {
                            steps {
                                script {
                                    // Allow the linting to fail
                                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                                        sh 'npm run lint-report'
                                    }
                                }
                            }
                            post {
                                always {
                                    recordIssues enabledForFailure: true, tool: checkStyle()
                                }
                                cleanup {
                                    sh 'rm checkstyle-result.xml'
                                }
                            }
                        }
                        stage('Testing') {
                            environment {
                                CI=true
                            }
                            steps {
                                script {
                                    // Allow the test to fail for now..
                                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                                        sh 'npm run test:ci'
                                    }
                                }
                            }
                            post {
                                always {
                                    junit '**/junit*.xml'
                                    publishCoverage adapters: [coberturaAdapter(path: '**/cobertura-coverage.xml')]
                                }
                                cleanup {
                                    sh 'rm -vf junit.xml'
                                    sh 'rm -vrf coverage'
                                }
                            }
                        }
                    }
                }
                stage('Build npm package') {
                    steps {
                        script {
                            sh 'NODE_ENV=production npm run build'
                        }
                    }
                }
            }
        }
        stage('Build docker image') {
            steps {
                script {
                    sh('pwd')
                    docker_image = docker.build("${IMAGE_TAG}", '--pull --no-cache -f ./Dockerfile .')
                }
            }
        }
        stage('Push image to harbor') {
            steps {
                script {
                    docker_image.push()
                }
            }
        }
        stage('Tag image as latest/utv') {
            when { branch 'main' }
            steps {
                script {
                    docker_image.push('latest')
                    docker_image.push('utv')
                }
            } 
        }
    }
    post {
        cleanup {
            sh 'rm -vrf build'
            sh "docker rmi -f \$(docker images --filter 'reference=${IMAGE_TAG}' -q)"
        }
    }
}
