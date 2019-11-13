FROM node:10.15.1 as build-deps
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install -g npm@5.6.0
EXPOSE 3000
CMD ["npm", "start"]


#this is used to remove all the dependencies 

FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
