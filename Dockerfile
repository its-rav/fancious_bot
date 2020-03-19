FROM node:12.14.0-alpine

RUN mkdir /usr/app

RUN mkdir /usr/app/src

COPY ./src /usr/app/src

COPY ./package.json /usr/app/package.json

WORKDIR /usr/app

RUN npm install

CMD npm run dev

EXPOSE 3000