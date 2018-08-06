FROM node:8

WORKDIR /usr/src/appv2

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
