FROM node:20.17-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY --chown=node:node . /app

ENV DEBUG=myapp:

EXPOSE 3000

CMD [ "npm", "run", "start" ]