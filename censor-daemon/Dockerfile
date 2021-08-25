FROM node:14.17-alpine3.12
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 9003
CMD ["node", "./dist/App.js"]