# docker-hook

Simple Node.js server to listening for docker.io hooks.

### Setup

All you need is only Node.js. So far tested only on `v9.11.1`. You can check out how to install 
Node.js on your OS here [Install Node.js](https://nodejs.org/en/download/current/)

### Using

Settings can be set by modifying `./conf.js` or exporting environment variables:

  * DOCKER_HOOK_HOST - host on which Node.js server will listen (default `localhost`)
  * DOCKER_HOOK_PORT - port on which Node.js server will listen (default `8585`)
  * DOCKER_HOOK_TOKEN - request query param `token` which should be provided by docker.io hook call 
  (default `someNotProperToken`)
  * DOCKER_HOOK_SCRIPT_PATH - path to `file.sh` which will be execute (no default value, required)
  * DOCKER_HOOK_TARGET_TAG - docker.io provides tag in data, it uses for filtering on which tag refresh
   local images (default `latest-dev`)
   
   
To start server type:
```
$ npm start
```

If you want to start it in background (usually you do :) ) you can use `forever` package:

```
$ npm i forever -g && forever start ./app.js
```