FROM node:14.15.1
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 9003
CMD ["node", "./dist/App.js"]