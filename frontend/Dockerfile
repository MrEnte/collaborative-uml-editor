# base image
FROM node:18-alpine

# setup environment variable
ENV DockerHOME=/home/collaborative-uml-editor/frontend

# set work directory
RUN mkdir -p $DockerHOME

# where your code lives
WORKDIR $DockerHOME

# copy whole project to your docker home directory.
COPY . $DockerHOME

# run this command to install all dependencies
RUN yarn install --frozen-lockfile

# port where the React app runs
EXPOSE 3000

# start server
CMD ["yarn", "start"]