const {app, redis} = require("./app");
const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080
let server;

const CHANNEL = process.env.REDIS_CHANNEL || "notification-pubsub"

let startServer = function () {
    server = http.createServer(app);
    let wss = new WebSocket.Server({ server });
    redis.on('message', (channel, message) => {
        if (channel == CHANNEL) {
            wss.clients.forEach(client => {
                client.send(message);
            })
        }
    });
    redis.subscribe(CHANNEL);
    return new Promise(resolve => {
        server.listen(PORT, () => {
            resolve(server);
            console.log(`listening on port ${PORT}`);
        });
    });
}

let TEST_JEST = process.env.TEST_JEST || false;

if (!TEST_JEST) startServer();

module.exports = {
    app,
    startServer
}