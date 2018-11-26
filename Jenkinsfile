#!/usr/bin/env groovy

node ('evalg') {
    def workspace = pwd()
    def project = 'usit-int'
    def image_version

    stage ('Checkout') {
        checkout scm
        image_version = sh(
            returnStdout: true,
            script: 'git describe --dirty=+ --tags'
        ).trim() - /^v/
    }
    stage ('Build evalg-frontend image') {
        sh "docker build \
            -t '${project}/valg-evalg' \
            -f Dockerfile ."
        sh "docker tag '${project}/valg-frontend' '${project}/valg-frontend:${image_version}'"
    }
    stage ('Push images') {
        sh "docker push '${project}/valg-frontend'"
    }
}
