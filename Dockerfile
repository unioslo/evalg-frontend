FROM harbor.uio.no/library/node:10-alpine

MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

WORKDIR /usr/src/app
COPY . /usr/src/app

# Default backend is localhost. Update to evalg-test01
# TODO: Make dynamic
RUN rm -v /usr/src/app/src/index.tsx 
COPY ./staging/index.tsx.template /usr/src/app/src/index.tsx

COPY package*.json yarn.lock ./
RUN yarn && yarn build

# Copy build to nginx image
FROM harbor.uio.no/library/nginx:latest
RUN rm -v /etc/nginx/nginx.conf
ADD staging/nginx.conf /etc/nginx/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
