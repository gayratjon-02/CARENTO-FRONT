#!/bin/bash

#PRODUCTION

git reset --hard
git checkout master
git pull origin master

docker stop  carento-front
docker rm carento-front


docker compose up -d