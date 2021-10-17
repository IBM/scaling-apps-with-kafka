const KafkaWrapper = require('./KafkaWrapper.js');
const {app, redis} = require("./app");
const axios = require('axios').default;
const NotifyHelper = require('./sendNotificationHelper');

const PORT = process.env.PORT || 8080

KafkaWrapper.consumer.on('ready', function() {
    console.log('The consumer has connected.');
    KafkaWrapper.consumer.subscribe(['orders']);
    KafkaWrapper.consumer.consume();

    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}).on('data', function(data) {
    try {
        let dataObject = JSON.parse(data.value.toString())
        // dataObject for orders
        // {eventType, payload: {orderId,userId,kitchenId,requestId}, simulatorConfig: {}}
        let eventType = dataObject.eventType;
        let payload = dataObject.payload;
        let kitchenId = payload.kitchenId;
        switch (eventType) {
            case "orderCreated":
                // get callback url from redis
                // send notification
                redis.get(kitchenId).then(result => {
                    // result is callback url
                    if (result) {
                        let requestBody = NotifyHelper.payloadToRequestBody(payload, eventType);
                        NotifyHelper.notifyOnCallbackURL(result, requestBody);
                    }
                }).catch(err => {
                    console.log(err)
                })
                KafkaWrapper.consumer.commitMessage(data)
                break;
            case "delivered":
                // get callback url from redis
                // send notification
                redis.get(kitchenId).then(result => {
                    // result is callback url
                    if (result) {
                        let requestBody = NotifyHelper.payloadToRequestBody(payload, eventType);
                        NotifyHelper.notifyOnCallbackURL(result, requestBody);
                    }
                }).catch(err => {
                    console.log(err)
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

KafkaWrapper.consumer.connect();