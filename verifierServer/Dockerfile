FROM node:16-alpine
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn --frozen-lockfile

COPY . .
EXPOSE 4040
CMD ["yarn", "start"]
