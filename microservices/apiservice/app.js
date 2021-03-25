const { response } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
const KafkaProducer = require('./KafkaProducer.js') 
const { v4: uuidv4 } = require('uuid');
const { createProxyMiddleware } = require('http-proxy-middleware')
const needle = require('needle');

const PORT = process.env.PORT || 8080

const STATUS_SERVICE = process.env.STATUS_SERVICE || 'http://status:8080'

app.use('/status', createProxyMiddleware({ target: STATUS_SERVICE, changeOrigin: true }))

function setStatus(key, value) {
    let data = { value }
    return needle('post', STATUS_SERVICE + '/status/' + key, data, { json: true })
}

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
            setStatus(requestId, JSON.stringify({status: "processing"}))
                .then(response => {
                    res.status('202').send({requestId, payloadSent: order})
                })
                .catch(err => {
                    res.status('404').send({requestId, error: "Error sending message", err})
                })
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
            setStatus(requestId, JSON.stringify({status: "processing"}))
                .then(response => {
                    res.status('202').send({requestId, payloadSent: {restaurants}})
                })
                .catch(err => {
                    console.log(err)
                    res.status('404').send({requestId, error: "Error sending message", err})
                })
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
            setStatus(requestId, JSON.stringify({status: "processing"}))
                .then(response => {
                    res.status('202').send({requestId, status: "processing"})
                })
                .catch(err => {
                    res.status('404').send({requestId, error: "Error sending message", err})
                })
        }
    })
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
            setStatus(requestId, JSON.stringify({status: "processing"}))
                .then(response => {
                    res.status('202').send({requestId, status: "processing"})
                })
                .catch(err => {
                    res.status('404').send({requestId, error: "Error sending message", err})
                })
        }
    })
})

KafkaProducer.on('ready', function() {
    console.log('The producer has connected.')
    
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
})