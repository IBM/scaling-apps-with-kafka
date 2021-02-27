const KafkaWrapper = require('./KafkaWrapper.js')
const mongoose = require('mongoose');
const Redis = require('ioredis');
const MUUID = require('uuid-mongodb').mode('relaxed');
const Order = require('./models/order.js')

// connect to redis localhost
const redis = new Redis()

// environment variables for mongodb connection
const MONGODB_REPLICA_HOSTNAMES = process.env.MONGODB_REPLICA_HOSTNAMES
// const MONGODB_REPLICA_SET = process.env.MONGODB_REPLICA_SET
// const MONGODB_DBNAME = process.env.MONGODB_DBNAME
// const MONGODB_AUTH_DBNAME = process.env.MONGODB_AUTH_DBNAME || MONGODB_DBNAME
// const MONGODB_CA_PATH = process.env.MONGODB_CA_PATH
// const MONGODB_USER = process.env.MONGODB_USER
// const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
mongoose
    .connect('mongodb://' + MONGODB_REPLICA_HOSTNAMES + '/', {
        // user: MONGODB_USER,
        // pass: MONGODB_PASSWORD,
        dbName: "example-food-delivery",
        // replicaSet: MONGODB_REPLICA_SET,
        // authSource: MONGODB_AUTH_DBNAME,
        // tls: true,
        // tlsCAFile: MONGODB_CA_PATH,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true})
    .catch(error => {
        console.log(error)
        process.exit(1)
    });

KafkaWrapper.consumer.on('ready', function() {
    console.log('The consumer has connected.');
    KafkaWrapper.consumer.subscribe(['orders']);
    KafkaWrapper.consumer.consume()
}).on('data', function(data) {
    try {
        let dataObject = JSON.parse(data.value.toString())
        // dataObject
        // {eventType, payload: {orderId,userId,kitchenId,requestId}, simulatorConfig}
        let eventType = dataObject.eventType
        let order = dataObject.payload
        let simulatorConfig = dataObject.simulatorConfig
        switch (eventType) {
            case "orderRequested":
                createOrderDocument(order, err => {
                    let statusMessage
                    if (err) {
                        console.log("error saving document")
                        console.error(err)
                        statusMessage = {status: "Order failed saving in database"}
                    } else {
                        console.log(`Order ID ${order.orderId} saved`)
                        statusMessage = {status: "orderCreated"}
                    }
                    redis.set(order.requestId, JSON.stringify(statusMessage))
                    // produce kafka message with eventType orderCreated
                    KafkaWrapper.createdOrderEvent(order, simulatorConfig, err => {
                        if (err) {
                            console.log("error producing event")
                            console.error(err)
                        } else {
                            console.log(`orderCreated event for ${order.orderId} created`)
                        }
                    })
                    KafkaWrapper.consumer.commitMessage(data)
                })
                break;
            case "orderCreated":
                setTimeout(() => {
                    setOrderStatusTo(order.orderId, 'orderValidated', (err, doc) => {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log(`Order ${order.orderId} is validated.`)
                            // kitchen consumer will handle orderValidated
                            KafkaWrapper.validatedEvent(order, simulatorConfig, err => {
                                if (err) {
                                    console.log("error producing event")
                                    console.error(err)
                                } else {
                                    console.log(`orderValidated event for ${order.orderId} created`)
                                }
                            })
                        }
                    })
                }, 5000)
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "kitchenPreparingFood":
                setOrderStatusTo(order.orderId, 'kitchenPreparingFood', (err, doc) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(`Order ${order.orderId} status updated to kitchenPreparingFood`)
                    }
                })
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "kitchenFoodReady":
                setOrderStatusTo(order.orderId, 'kitchenFoodReady', (err, doc) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(`Order ${order.orderId} status updated to kitchenFoodReady`)
                    }
                })
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "courierMatched":
                setOrderStatusTo(order.orderId, 'courierMatched', (err, doc) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(`Order ${order.orderId} status updated to courierMatched`)
                    }
                })
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "courierPickedUp":
                setOrderStatusTo(order.orderId, 'courierPickedUp', (err, doc) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(`Order ${order.orderId} status updated to courierPickedUp`)
                    }
                })
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "delivered":
                setOrderStatusTo(order.orderId, 'delivered', (err, doc) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(`Order ${order.orderId} status updated to delivered`)
                    }
                })
                KafkaWrapper.consumer.commitMessage(data)
                break;
            default:
                console.log(`${dataObject.eventType} is not handled in this service`)
                KafkaWrapper.consumer.commitMessage(data)
        }
    } catch (err) {
        console.error(err)
        // add error response to redis
        KafkaWrapper.consumer.commitMessage(data)
    }
});

function createOrderDocument(payload, callback) {
    let order = {
        orderId: MUUID.from(payload.orderId),
        userId: MUUID.from(payload.userId),
        kitchenId: MUUID.from(payload.kitchenId),
        status: "orderCreated",
        totalPrice: payload.totalPrice
    }
    let newOrder = new Order(order)
    newOrder.save(err => callback(err))
}

function setOrderStatusTo(orderId, status, callback) {
    let filter = { orderId: MUUID.from(orderId) }
    let update = { status }

    Order.findOneAndUpdate(filter, update, {new: true}, (err, doc) => {
        callback(err, doc)
    })
}

KafkaWrapper.producer.on('ready', () => {
    console.log('The producer has connected.')
    KafkaWrapper.consumer.connect()
})