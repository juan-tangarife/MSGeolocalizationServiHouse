FROM node:19

RUN mkdir /home/app
WORKDIR /home/app

COPY package*.json ./
COPY . .

EXPOSE 8800

CMD ["npm", "start"]