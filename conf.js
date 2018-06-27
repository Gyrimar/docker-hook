module.exports = {
    host: process.env.DOCKER_HOOK_HOST || 'localhost',
    port: process.env.DOCKER_HOOK_PORT || 8585,
    token: process.env.DOCKER_HOOK_TOKEN || "someNotProperToken",
    scriptPath: process.env.DOCKER_HOOK_SCRIPT_PATH,
    targetTag: process.env.DOCKER_HOOK_TARGET_TAG || 'latest-dev',
};