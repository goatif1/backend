FROM node:16

WORKDIR /opt/goatif1/backend

COPY . .

RUN npm install

RUN npm install -g nodemon

EXPOSE 3080

CMD [ "npm", "start" ]