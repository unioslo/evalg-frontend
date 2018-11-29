FROM harbor.uio.no/library/python:3-alpine

MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

# Proxy for updates during build
ENV http_proxy="http://updateproxy.uio.no:3128"
ENV https_proxy="https://updateproxy.uio.no:3128"

WORKDIR /usr/src/evalg

# Add dependencies
COPY requirements.txt /usr/src/evalg

# Install build-deps, then install/build deps
RUN set -ex \
    && apk add --no-cache --virtual .evalg-build-deps \
            gcc \
            make \
            libc-dev \
            musl-dev \
            linux-headers \
    && apk add --no-cache --virtual .evalg-deps \
            git \
            bash \
            postgresql-dev \
#    && pip3 install -U pip \
#    && pip3 install -r /usr/src/evalg/requirements.txt \
#    && apk del .evalg-build-deps

# Reset proxy -- we don't want the build image to have these
ENV http_proxy=""
ENV https_proxy=""

RUN pip3 config set global.index-url https://repo.usit.uio.no/nexus/repository/pypi-usit/simple \
    && pip3 config set global.index https://repo.usit.uio.no/nexus/repository/pypi-usit/pypi \
    && pip3 install -U pip \
    && pip3 install -r /usr/src/evalg/requirements.txt \
    && apk del .evalg-build-deps

# Install app
COPY . /usr/src/evalg
COPY ./instance /usr/local/var/evalg-instance
RUN pip3 install --editable /usr/src/evalg
