#!/usr/bin/env groovy

node ('evalg') {
    def image_version = "${env.BUILD_TAG}"
    def workspace = pwd()

    stage ('Checkout') {
        checkout scm
    }
    stage ('Build test image') {
        sh "docker build -t 'valg-dev:${image_version}' -f Dockerfile-dev ."
    }
    try {
        stage ('Run tests') {
            sh "mkdir -p reports && chcon -Rt svirt_sandbox_file_t reports"
            sh "rm -vf reports/junit*.xml"
            try {
                sh "docker run -v ${workspace}/reports:/reports --rm \
                    'valg-dev:${image_version}' \
                    python -m pytest --junit-xml /reports/junit.xml"
            } finally {
                junit 'reports/junit.xml'
            }
        }
    } finally {
        stage ('Clean up') {
            sh "docker rmi 'valg-dev:${image_version}'"
        }
    }
}