#!/usr/bin/env groovy

boolean isMasterBranch() {
    return env.BRANCH_NAME.matches('master')
}

node ('evalg') {
    def image_version = "${env.BUILD_TAG}"
    def workspace = pwd()

    stage ('Checkout') {
        // sh "echo version='${version}'"
        sh "echo workspace='${workspace}'"
        checkout scm
    }
    stage ('Make environment') {
        withEnv (['HTTP_PROXY=updateproxy.uio.no:3128',
                 'HTTPS_PROXY=updateproxy.uio.no:3128']) {
            sh "virtualenv --no-download ${workspace}/venv"
            python = "${workspace}/venv/bin/python"
            pip = "${workspace}/venv/bin/pip"
            sh "${pip} install -r requirements-dev.txt"
            sh "${pip} install -r requirements.txt"
            sh "${python} setup.py install"
        }
    }
    stage ('Run tests') {
        sh "mkdir -p reports"
        sh "rm -vf reports/junit*.xml"
        try {
            sh "${python} -m pytest --junit-xml reports/junit.xml"
        } finally {
            junit 'reports/junit.xml'
        }
    }
    if (isMasterBranch()) {
        stage('Build ballotbox image') {
            sh "docker build -t 'evalg-ballotbox:${image_version}' --build-arg HTTP_PROXY=updateproxy.uio.no:3128 --build-arg HTTPS_PROXY=updateproxy.uio.no:3128 -f Dockerfile-ballotbox ."
        }
        stage('Build evalg image') {
            sh "docker build -t 'evalg-evalg:${image_version}' --build-arg HTTP_PROXY=updateproxy.uio.no:3128 --build-arg HTTPS_PROXY=updateproxy.uio.no:3128 -f Dockerfile-evalg ."
        }
    }
    /*
    */
}
