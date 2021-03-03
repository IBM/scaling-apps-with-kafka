const KafkaWrapper = require('./KafkaWrapper.js')
const mongoose = require('mongoose');
const Redis = require('ioredis');
const MUUID = require('uuid-mongodb').mode('relaxed');
const Kitchen = require('./models/kitchen.js')

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
        // dataObject for orders
        // {eventType, payload: {orderId,userId,kitchenId,requestId}, simulatorConfig: {}}
        let eventType = dataObject.eventType
        let payload = dataObject.payload
        let simulatorConfig = dataObject.simulatorConfig || {}
        let kitchenDelay = simulatorConfig.kitchenSpeed || 5000
        switch (eventType) {
            case "courierMatched":
                // simulate to 5 seconds process
                setTimeout(() => {
                    KafkaWrapper.preparingFoodEvent(payload, simulatorConfig, err => {
                        if (err) {
                            console.log("error producing event")
                            console.error(err)
                        } else {
                            console.log(`kitchenPreparingFood event for ${payload.orderId} created`)
                        }
                    })
                }, kitchenDelay)
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "kitchenPreparingFood":
                // simulate to 5 seconds process
                setTimeout(() => {
                    KafkaWrapper.foodReadyEvent(payload, simulatorConfig, err => {
                        if (err) {
                            console.log("error producing event")
                            console.error(err)
                        } else {
                            console.log(`kitchenFoodReady event for ${payload.orderId} created`)
                        }
                    })
                }, kitchenDelay)
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "kitchenNewSimulatedListRequest":
                createKitchenList(payload, (err, restaurants) => {
                    let statusMessage
                    if (err) {
                        console.log("error saving kitchen list")
                        console.error(err)
                        statusMessage = {status: "Kitchen list failed saving in database"}
                    } else {
                        console.log(`Kitchen list saved`)
                        statusMessage = {status: "kitchen list created"}
                    }
                    redis.set(payload.requestId, JSON.stringify(statusMessage))
                })
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "kitchenRestaurantsList":
                getKitchenList((err, docs) => {
                    if (err) {
                        console.log("error getting restaurants")
                        console.error(err);
                        redis.set(payload.requestId, JSON.stringify({status: "error getting events"}))
                    } else {
                        redis.set(payload.requestId, JSON.stringify({status: "success", docs}))
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

function createKitchenList(payload, callback) {
    // let restaurants = payload.map(restaurant => {
    //     restaurant.kitchenId = MUUID.from(restaurant.kitchenId)
    //     return restaurant
    // })
    Kitchen.insertMany(restaurants, (err, restaurants) => {callback(err, restaurants)})
}

function getKitchenList(callback) {
    Kitchen.find((err, docs) => {
        console.log('find query')
        console.log(err)
        console.log(docs)
        callback(err, docs)
    })
}
KafkaWrapper.producer.on('ready', () => {
    console.log('The producer has connected.')
    KafkaWrapper.consumer.connect()
})