FROM registry.tools.3stripes.net/eft-wm-images-public/node:16.16.0-alpine3.15 as build
WORKDIR /src
RUN --mount=type=cache,target=/var/cache/apk \
  apk add --update --virtual build-dependencies build-base \
  bash \
  curl \
  g++ \
  make \
  python3 
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/src/.npm \
    npm set cache /src/.npm && \
    npm ci
COPY . .

FROM registry.tools.3stripes.net/eft-wm-images-public/node:16.16.0-alpine3.15
WORKDIR /src
COPY --from=build /src /src
EXPOSE 8005
CMD ["npm", "start"]