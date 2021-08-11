#!/usr/bin/env bash
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`
GIT_SHA=`git rev-parse --short HEAD`
REPO="harbor.uio.no"
PROJECT="it-usit-int-drift"
APP_NAME="valg-frontend"
CONTAINER="${REPO}/${PROJECT}/${APP_NAME}"
IMAGE_TAG="${CONTAINER}:${GIT_BRANCH}-${GIT_SHA}"

echo "Running npm build"
NODE_ENV=production npm run build

echo "Building $IMAGE_TAG"
docker build --pull --no-cache -f Dockerfile-k8s -t $IMAGE_TAG .

echo "Pushing $IMAGE_TAG"
# docker push $IMAGE_TAG

#if [[ $GIT_BRANCH = "master" ]]
#then
echo "On master-branch, setting $IMAGE_TAG as $CONTAINER:openshift"
docker tag $IMAGE_TAG $CONTAINER:openshift
docker push $CONTAINER:openshift
#fi
