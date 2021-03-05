const { response } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
const KafkaProducer = require('./KafkaProducer.js') 
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis')

// connect to redis localhost
const redis = new Redis()
// catch error connection redis

const PORT = process.env.PORT || 8080

app.use(express.json());
app.use(cors())

// {
//     "orderId":"",
//     "userId":"",
//     "kitchenId":"",
//     "food":[{
//         "name":"",
//         "quantity":"",
//         "price":""
//     }],
//     "deliveryLocation":{
//         "customerName":""
//         "long":"",
//         "lat":"",
//         "address":""
//     }
//     "totalPrice":""
//     "deliveredBy":{
//         "id":"",
//         "name":""
//     }
//     "status":""
// }
app.post("/createOrder", (req, res) => {
    let orderId = uuidv4()
    let userId = req.body.userId || uuidv4() // assign unique user id for simulation
    let requestId = uuidv4()
    let kitchenId = req.body.kitchenId || uuidv4()
    let dish = req.body.dish || "testDish"
    let totalPrice = req.body.totalPrice || (Math.random() * 100).toFixed(2)
    let order = {
        orderId,
        userId,
        kitchenId,
        dish,
        totalPrice
    }
    // simulatorConfig
    let kitchenSpeed = req.body.kitchenSpeed || 5000
    let courierSpeed = req.body.courierSpeed || 5000

    KafkaProducer.publishOrder({...order, requestId}, {kitchenSpeed, courierSpeed}, (err) => {
        if (err) {
            console.log(err)
            res.status('404').send({requestId, error: "Error sending message"})
        } else {
            redis.set(requestId, JSON.stringify({status: "processing"}))
            res.status('202').send({requestId, payloadSent: order})
        }
    })
})

// create restaurants
app.post("/restaurants", (req, res) => {
    let requestId = uuidv4()
    let restaurants = req.body
    KafkaProducer.createRestaurants(requestId, restaurants, (err) => {
        if (err) {
            console.log(err)
            res.status('404').send({requestId, error: "Error sending message"})
        } else {
            redis.set(requestId, JSON.stringify({status: "processing"}))
            res.status('202').send({requestId, payloadSent: {restaurants}})
        }
    })
})

// get restaurants
app.get("/restaurants", (req, res) => {
    let requestId = uuidv4()
    KafkaProducer.getRestaurants(requestId, (err) => {
        if (err) {
            console.log(err)
            res.status('404').send({requestId, error: "Error sending message"})
        } else {
            redis.set(requestId, JSON.stringify({status: "processing"}))
            res.status('202').send({requestId, status: "processing"})
        }
    })
    redis.set(requestId, JSON.stringify({status: "processing"}))
})

// get status
app.get("/user/:userId/orders", (req, res) => {
    let requestId = uuidv4()
    let userId = req.params.userId
    KafkaProducer.getOrdersOfUser({requestId, userId}, (err) => {
        if (err) {
            console.log(err)
            res.status('404').send({requestId, error: "Error sending message"})
        } else {
            redis.set(requestId, JSON.stringify({status: "processing"}))
            res.status('202').send({requestId, status: "processing"})
        }
    })
    redis.set(requestId, JSON.stringify({status: "processing"}))
})

// get status
app.get("/status/:requestId", (req, res) => {
    let requestId = req.params.requestId
    redis.get(requestId).then(result => {
        console.log(result)
        res.status('200').send(JSON.parse(result))
    }).catch(err => {
        console.log(err)
        res.send('404').send(err)
    })
})

KafkaProducer.on('ready', function() {
    console.log('The producer has connected.')
    
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
})