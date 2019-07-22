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
        stage('Install dependencies') {
            steps {

                script {
                    sh('scl enable rh-nodejs8 "npm config set proxy http://software-proxy.uio.no:3128"')
                    sh('scl enable rh-nodejs8 "npm config set https-proxy http://software-proxy.uio.no:3128"')
                    sh('scl enable rh-nodejs8 "npm install"')
                }
            }
        }
        stage('Run Tests') {
            parallel {
                stage('Linting') {
                    steps {
                        script {
                            // Allow the linting to fail
                            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                                sh('scl enable rh-nodejs8 "npm run lint-report"')
                            }
                        }
                    }
                    post {
                        always {
                            recordIssues enabledForFailure: true, tool: checkStyle()
                        }
                        cleanup {
                            sh('rm checkstyle-result.xml')
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
                                sh('scl enable rh-nodejs8 "npm run test:ci"')
                            }
                        }
                    }
                    post {
                        always {
                            junit '**/junit*.xml'
                            publishCoverage adapters: [coberturaAdapter(path: '**/cobertura-coverage.xml')]
                        }
                        cleanup {
                            sh('rm -vf junit.xml')
                            sh('rm -vrf coverage')
                        }
                    }
                }

            }
        }
        stage('Build npm package') {
            steps {
                script {
                    sh('scl enable rh-nodejs8 "NODE_ENV=production npm run build"')
                }
            }
        }
        stage('Build docker image') {
            steps {
                script {
                    docker_image = docker.build("${IMAGE_TAG}", '-f ./Dockerfile .')
                }
            }
        }
        stage('Deploy') {
            parallel {
                stage('Push image to harbor') {
                    steps {
                        script {
                            docker_image.push()
                        }
                    }
                }
                stage('Tag image as latest/utv') {
                    when { branch 'master' }
                    steps {
                        script {
                            docker_image.push('latest')
                            docker_image.push('utv')
                        }
                    }
                }
            }
        }
    }
    post {
        cleanup {
            sh('rm -vrf build')
            sh("docker rmi \$(docker images --filter 'reference=${IMAGE_TAG}' -q)")
        }
    }
}