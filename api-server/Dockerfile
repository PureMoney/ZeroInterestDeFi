# pull the base image
FROM node:14.17.1

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY yarn.lock ./

RUN mkdir -p root/.config/solana

RUN yarn install

RUN sh -c "$(curl -sSfL https://release.solana.com/v1.7.3/install)"

# dont know the correct path to copy this
COPY id.json ./

# add app
COPY . ./

EXPOSE 3001

# start app
CMD ["yarn", "start"]