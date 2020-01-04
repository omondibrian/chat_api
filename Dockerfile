
FROM node:10.13-alpine

WORKDIR /ChatApi/app
COPY package*.json ./
COPY . .
EXPOSE 4000
CMD ["npm","start"]