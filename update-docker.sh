#! /bin/bash

docker-compose -f ~/docker-compose.yml pull api web;
docker-compose -f ~/docker-compose.yml up -d api web;