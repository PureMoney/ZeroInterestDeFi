# pull the base image
FROM node:14.17.1

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY yarn.lock ./

RUN yarn install

# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["yarn", "start"]