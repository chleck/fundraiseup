
# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
RUN chown node:node /app
USER node
COPY package*.json .
COPY yarn.lock .
RUN yarn install
COPY . .
# build stage
FROM develop-stage as build-stage
RUN yarn build
# production stage
# FROM nginx:1.15.7-alpine as production-stage
# COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
