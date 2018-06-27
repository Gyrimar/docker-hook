const http = require('http');
const queryString = require('querystring');
const childProcess = require('child_process');
const config = require('./conf');

if (!config.scriptPath) {
    console.log('Error: DOCKER_HOOK_SCRIPT_PATH variable didn\'t set.');
    process.exit(1);
}

const server = http.createServer((request, response) => {
    const { headers, method, url } = request;
    const query = queryString.parse(url.split('?')[1]);
    let body = [];

    if (method !== 'POST') {
        response.statusCode = 404;
        response.end();
        return;
    }

    if (headers['content-type'] !== 'application/json') {
        console.error('Bad Content-Type');

        response.statusCode = 400;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Bad Content-Type');
        return;
    }

    if (!query.token || query.token !== config.token) {
        console.error('Bad token');

        response.statusCode = 400;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Bad token');
        return;
    }

    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        const targetTag = config.targetTag;
        const tag = body.push_data && body.push_data.tag ? body.push_data.tag : '';

        try {
            body = JSON.parse(body);

            if (tag) {
                let shouldSkip;

                if (tag.indexOf('*') !== -1) {
                    const searchPattern = targetTag.replace('*', '');

                    if (searchPattern) {
                        shouldSkip = tag.indexOf(searchPattern) === -1;
                    } else {
                        // if we get here it means that targetTag was '*' and we update on all tags
                        shouldSkip = false;
                    }
                } else {
                    shouldSkip = tag !== targetTag;
                }

                if (shouldSkip) {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'text/plain');
                    response.end('ok');
                    return;
                }
            }

            console.log('starting update');
            childProcess.execFileSync(config.scriptPath);
            console.log('finish update');

            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/plain');
            response.end('ok');
        } catch (err) {
            console.error(err);

            response.statusCode = 500;
            response.setHeader('Content-Type', 'text/plain');
            response.end(err.message);
        }
    });
});

server.listen(config.port, config.host, () => {
    console.log(`Listening for docker hook at http://${config.host}:${config.port}/`);
});