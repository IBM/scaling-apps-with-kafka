const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const KafkaWrapper = require('./KafkaWrapper.js');
const { admin } = require('./KafkaWrapper.js');

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });
let PORT = process.env.PORT || 8080

wss.on('connection', (ws, req) => {
    ws.PATHNAME = req.url
})

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;
    console.log(pathname)

    if (pathname === '/events') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else if (pathname === '/events/consumergroupsoffset') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

// send events to ws clients each second
let eventsArray = []
let eventsArraySendInterval = setInterval(() => {
    if (eventsArray.length > 0) {
        let temp = [...eventsArray]
        eventsArray = []
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.PATHNAME === '/events') {
                client.send(JSON.stringify(temp));
            }
        });
    }
}, 1000)

KafkaWrapper.consumer.on('ready', function() {
    console.log('The consumer has connected.');
    KafkaWrapper.consumer.subscribe(['orders']);
    KafkaWrapper.consumer.consume()
    // setInterval(() => {
    //     KafkaWrapper.consumer.committed(1000, (err, topicPartitions) => {
    //         console.log(topicPartitions)
    //     })
    // }, 1000)

    // start server
    server.listen(PORT);
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

        // add filter for specific events only
        if (dataObject.eventType == "orderRequested" || 
            // dataObject.eventType == "orderCreated" ||
            // dataObject.eventType == "orderValidated" ||
            // dataObject.eventType == "courierMatched" ||
            // dataObject.eventType == "courierPickedUp" ||
            // dataObject.eventType == "kitchenPreparingFood" ||
            // dataObject.eventType == "kitchenFoodReady" ||
            dataObject.eventType == "delivered") {
            eventsArray.push(dataObject)
        }
        KafkaWrapper.consumer.commitMessage(data)
    } catch (err) {
        console.error(err)
        // add error response to redis
        KafkaWrapper.consumer.commitMessage(data)
    }
});

KafkaWrapper.consumer.connect()

// KafkaJS admin api
KafkaWrapper.admin.on('admin.connect', (e) => {
    console.log('admin connected')
    getOffsets()
})
KafkaWrapper.admin.connect()

let previousOffset = null
let difference = null
async function getOffsets() {
    let orders = await KafkaWrapper.admin.fetchOffsets({ groupId: 'orders-consumer-group', topic: 'orders'})
    let kitchen = await KafkaWrapper.admin.fetchOffsets({ groupId: 'kitchen-consumer-group', topic: 'orders'})
    let courier = await KafkaWrapper.admin.fetchOffsets({ groupId: 'courier-consumer-group', topic: 'orders'})
    let status = await KafkaWrapper.admin.fetchOffsets({ groupId: 'status-consumer-group', topic: 'orders'})
    // console.log(orders)
    orders = getSumOfPartitionsOffset(orders)
    kitchen = getSumOfPartitionsOffset(kitchen)
    courier = getSumOfPartitionsOffset(courier)
    status = getSumOfPartitionsOffset(status)
    let currentOffset = { orders, kitchen, courier, status }
    if (!previousOffset) {
        // console.log('no previous')
    } else {
        difference = {}
        difference.orders = currentOffset.orders - previousOffset.orders
        difference.kitchen = currentOffset.kitchen - previousOffset.kitchen
        difference.courier = currentOffset.courier - previousOffset.courier
        difference.status = currentOffset.status - previousOffset.status
        // console.log(difference)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.PATHNAME === '/events/consumergroupsoffset') {
                client.send(JSON.stringify(difference));
            }
        });
    }

    previousOffset = currentOffset
    setTimeout(() => {
        getOffsets()
    }, 5000)
}

function getSumOfPartitionsOffset(array) {
    let sum = 0
    array.forEach(element => {
        sum = sum + Number(element.offset)
    })
    return sum
}