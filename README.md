# udemy-nuxt学習結果
gitではソースコードのみ管理する。
dockerを使う場合は、以下の構成にしていた。

```sh
.
-- app
----- Dockerfile
----- src ←このディレクトリで当リポジトリをgit clone
--docker-compose.yml
```

#####  docker-compose.yml
```sh
version: '3'
services:
  app:
    build: ./app
    command: npm run dev 
    privileged: true
    ports:
      - '3000:3000'
    volumes:
      - ./app/src:/home/app/nuxt
      - /home/app/nuxt/node_modules
```

##### Dockerfile
```sh
#ref:https://postd.cc/lessons-building-node-app-docker/
FROM node:9.11-alpine

#add user for security
#shadow: you can use useradd on alpine
RUN apk --update add shadow &&\
    rm -rf /var/cache/apk/* &&\
    useradd --user-group --create-home app
ENV HOME=/home/app
COPY ./src/package.json ./src/package-lock.json $HOME/nuxt/
RUN chown -R app:app $HOME/*
ENV HOST 0.0.0.0
USER app
WORKDIR $HOME/nuxt
# if you want clear cache, npm cache clean --force or npm install --no-cache
RUN npm install --no-cache

```


> My spectacular Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
