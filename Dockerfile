FROM node:12.12.0-alpine

WORKDIR /app

RUN apk update && \
  npm install -g \
  @vue/cli \
  firebase-tools && \
  rm -rf /var/lib/apt/lists/*

CMD ["/bin/sh"]
