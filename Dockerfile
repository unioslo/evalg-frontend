# Build stage
FROM harbor.uio.no/library/node:latest as build-stage

RUN mkdir /app
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Build app
COPY . /app
RUN NODE_ENV=production npm run build

# Make sure no client environment is included in the build
RUN rm /app/build/env.js

# Copy build to nginx image
FROM harbor.uio.no/library/nginx:latest
MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

# Install jq for the docker entrypoint
RUN set -x \
    && apt-get update \
    && apt-get install -y jq

COPY --from=build-stage /app/build /app/build
COPY --from=build-stage /app/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
