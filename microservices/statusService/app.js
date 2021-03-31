const KafkaWrapper = require('./KafkaWrapper.js')
const Redis = require('ioredis');
const express = require('express');
const app = express();
const cors = require('cors');

// connect to redis localhost
const redis = new Redis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    db: 0
})

const PORT = process.env.PORT || 8080

app.use(express.json());
app.use(cors())

app.get("/status/:requestId", (req, res) => {
    let requestId = req.params.requestId
    redis.get(requestId).then(result => {
        res.status('200').send(JSON.parse(result))
    }).catch(err => {
        console.log(err)
        res.status('404').send(err)
    })
})

app.post("/status/:requestId", (req, res) => {
    let requestId = req.params.requestId
    let value = req.body.value
    redis.get(requestId).then(result => {
        if (!result) {
            redis.set(requestId, value, 'EX', 3600)
        }
    }).catch(err => {
        console.log(err)
    })
    res.status('200').send('OK')
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

KafkaWrapper.consumer.on('ready', function() {
    console.log('The consumer has connected.');
    KafkaWrapper.consumer.subscribe(['orders']);
    KafkaWrapper.consumer.consume()
}).on('data', function(data) {
    try {
        let dataObject = JSON.parse(data.value.toString())
        // dataObject
        // {eventType, payload: {requestId, message}}
        let eventType = dataObject.eventType
        let payload = dataObject.payload
        switch (eventType) {
            case "updateHttpResponse":
                redis.set(payload.requestId, payload.message, 'EX', 3600)
                KafkaWrapper.consumer.commitMessage(data)
                break;
            default:
                // console.log(`${dataObject.eventType} is not handled in this service`)
                KafkaWrapper.consumer.commitMessage(data)
        }
    } catch (err) {
        console.error(err)
        // add error response to redis
        KafkaWrapper.consumer.commitMessage(data)
    }
});

KafkaWrapper.consumer.connect()
// KafkaWrapper.producer.on('ready', () => {
//     console.log('The producer has connected.')
//     KafkaWrapper.consumer.connect()
// })