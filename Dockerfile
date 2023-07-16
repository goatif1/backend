FROM node:16

WORKDIR /opt/goatifi/backend

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3080

CMD [ "npm", "start" ]