FROM node:12

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/

RUN rm -rf node_modules && npm install

COPY . /app

EXPOSE 80

CMD ["npm", "run", "prod"]
