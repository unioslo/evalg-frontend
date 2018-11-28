FROM harbor.uio.no/library/node:latest

MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY package*.json yarn.lock ./

# TODO fix this by adding the API to a config file
RUN sed -i 's/localhost:5000/evalg-test01.uio.no/g' /usr/src/app/src/index.tsx

RUN echo 123
RUN yarn \
 && yarn build

# Copy build to nginx image
FROM harbor.uio.no/library/nginx:latest
RUN rm -rf /usr/share/nginx/html/*
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
