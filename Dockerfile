FROM harbor.uio.no/library/python:3-alpine

MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

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
    && pip3 install -U pip \
    && pip3 install -r /usr/src/evalg/requirements.txt \
    && apk del .evalg-build-deps

# Install app
COPY . /usr/src/evalg
COPY ./instance /usr/local/var/evalg-instance
RUN pip3 install --editable /usr/src/evalg
