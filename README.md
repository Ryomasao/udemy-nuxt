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

## Herokuへデプロイ
Herokuのコンソールより、以下の環境変数を登録しておく
https://ja.nuxtjs.org/faq/heroku-deployment/

あとはいつも通り、push
```sh
git push heroku master
```

また、.envをHerokuでも使えるように、以下のプラグインをインストールしておく。
```sh
heroku plugins:install heroku-config
```

.env用意したら、以下のコマンドで反映できる
```sh
heroku config:push
```

ただ、上記コマンドを実行したときに、環境変数はかわってたんだけれども、アプリ側で.envの設定値が読めてなかった。  
再度、適当にpushしたら反映されたので、なにかあるのかな。
