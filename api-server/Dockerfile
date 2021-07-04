# pull the base image
FROM node:14.17.1

# install solana
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.7.3/install)"

# Make the directory to where the id.json is saved
RUN mkdir -p root/.config/solana

# Copy the id.json to the root
COPY id.json root/.config/solana

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./

RUN yarn install

# add app
COPY . ./

EXPOSE 3001

# start app
CMD ["yarn", "start"]