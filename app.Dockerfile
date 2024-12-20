FROM node:20.11.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20.11.1-alpine as runtime
WORKDIR /app
COPY package*.json ./
COPY --from=build /app/dist /app/dist
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/doc /app/doc
RUN npm ci --omit=dev && \
npm cache clean --force && \
rm -rf /root/.cache
EXPOSE ${PORT}
CMD [  "sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/src/main" ]