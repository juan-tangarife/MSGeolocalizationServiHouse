FROM node:19

RUN mkdir /home/app
WORKDIR /home/app

COPY package*.json ./

RUN npm install


COPY . .
COPY .env .env
RUN npx prisma generate


EXPOSE 8800

CMD ["npm", "start"]