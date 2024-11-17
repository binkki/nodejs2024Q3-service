FROM node:20.11.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD [  "sh", "-c", "npx prisma migrate deploy && npx prisma db seed" ]