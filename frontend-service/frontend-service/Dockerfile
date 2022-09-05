FROM node:16.16.0-alpine3.15 AS builder
WORKDIR /src
COPY package.json ./
COPY package-lock.json ./
RUN --mount=type=cache,target=/src/.npm \
    npm set cache /src/.npm && \
    npm ci
COPY . .
RUN if [ "$NODE_ENV" = "production" ] ; then npm run build:prod ; else npm run build:dev ; fi

FROM nginx:1.23.1-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /src/dist /usr/share/nginx/html
COPY --from=builder /src/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]