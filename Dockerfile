FROM harbor.uio.no/library/docker.io-nginx:latest

MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

# Proxy for updates during build
ENV http_proxy="http://software-proxy.uio.no:3128"
ENV https_proxy="https://software-proxy.uio.no:3128"

# Install jq for the docker entrypoint
RUN set -x \
    && apt-get update \
    && apt-get install -y jq

COPY ./build /app/build
COPY ./docker-entrypoint.sh /

# Proxy for updates during build
ENV http_proxy=""
ENV https_proxy=""

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
