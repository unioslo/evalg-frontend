FROM harbor.uio.no/library/node:latest

MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY package*.json ./run/

# TODO fix this by adding the API to a config file
RUN sed -i 's/localhost:5000/evalg-test01.uio.no/g' /usr/src/app/src/appConfig.ts \
 && sed -i 's/testWarning = false/testWarning = true/g' /usr/src/app/src/appConfig.ts

RUN npm install \
 && npm run build

# Copy build to nginx image
FROM harbor.uio.no/library/nginx:latest
MAINTAINER USITINT <bnt-int@usit.uio.no>
LABEL no.uio.contact=bnt-int@usit.uio.no

RUN rm -rf /usr/share/nginx/html/*
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
