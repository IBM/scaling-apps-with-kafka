const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const KafkaWrapper = require('./KafkaWrapper.js')

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {

})

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;
    console.log(pathname)

    if (pathname === '/events') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

KafkaWrapper.consumer.on('ready', function() {
    console.log('The consumer has connected.');
    KafkaWrapper.consumer.subscribe(['orders']);
    KafkaWrapper.consumer.consume()

    // start server
    server.listen(8081);
}).on('data', data => {
    // data 
    // {
    //     value: <Buffer>,
    //     size: 257,
    //     key: <Buffer>,
    //     topic: 'orders',
    //     offset: 449,
    //     partition: 0,
    //     timestamp: 1614058969974
    //   }
    try {
        let dataObject = JSON.parse(data.value.toString())
        // dataObject
        // {eventType, payload: {orderId,userId,kitchenId,requestId}}
        // add timestamp
        dataObject.timestamp = data.timestamp
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(dataObject));
                console.log('sent')
            }
        });
        KafkaWrapper.consumer.commitMessage(data)
    } catch (err) {
        console.error(err)
        // add error response to redis
        KafkaWrapper.consumer.commitMessage(data)
    }
});

KafkaWrapper.consumer.connect()