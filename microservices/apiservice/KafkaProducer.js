const Kafka = require('node-rdkafka');

class KafkaProducer {
    constructor(brokers, protocol, mechanism, username, password, ca_location) {
        let driver_options = {
            //'debug': 'all',
            'metadata.broker.list': brokers,
            'security.protocol': protocol ? protocol : 'ssl',
            'ssl.ca.location': ca_location ? ca_location : '/etc/ssl-kafka/ca.crt',
            'log.connection.close' : false
        };
        let producerConfig = {
            'client.id': 'example-orders-producer',
            'dr_msg_cb': true  // Enable delivery reports with message payload
        }

        for (var key in driver_options) {
            producerConfig[key] = driver_options[key]
        }

        // create kafka producer
        let topicConfig = {
            'request.required.acks': -1
            // 'produce.offset.report': true
        }
        let producer = new Kafka.Producer(producerConfig, topicConfig)
        producer.setPollInterval(100)

        // Register error listener
        producer.on('event.error', function(err) {
            console.error('Error from producer:' + JSON.stringify(err));
        });

        // Register delivery report listener
        producer.on('delivery-report', function(err, dr) {
            if (err) {
                console.error('Delivery report: Failed sending message ' + dr.value);
                console.error(err);
                // We could retry sending the message
            } else {
                console.log('Message produced, partition: ' + dr.partition + ' offset: ' + dr.offset);
            }
        });
        producer.connect()

        this.producer = producer
    }
  
    on(event, callback) {
      this.producer.on(event, callback)
    }

    publishOrder(order, simulatorConfig, callback) {
        let topicName = 'orders'
        let eventType = 'orderRequested'
        let message = Buffer.from(JSON.stringify({eventType, payload: order, simulatorConfig}))
        try {
            this.producer.produce(
                topicName,
                null,
                message,
                order.orderId
            )
            callback(null)
        } catch (err) {
            console.log('caught')
            callback(err)
        }
    }

    getRestaurants(requestId, callback) {
        let topicName = 'orders'
        let eventType = 'kitchenRestaurantsList'
        let message = Buffer.from(JSON.stringify({eventType, payload: {requestId}}))
        try {
            this.producer.produce(
                topicName,
                null,
                message
            )
            callback(null)
        } catch (err) {
            console.log('caught')
            callback(err)
        }
    }

    getOrdersOfUser(order, callback) {
        let topicName = 'orders'
        let eventType = 'getOrdersOfUser'
        let message = Buffer.from(JSON.stringify({eventType, payload: order}))
        try {
            this.producer.produce(
                topicName,
                null,
                message
            )
            callback(null)
        } catch (err) {
            console.log('caught')
            callback(err)
        }
    }

    createRestaurants(requestId, restaurants, callback) {
        let topicName = 'orders'
        let eventType = 'kitchenNewSimulatedListRequest'
        let message = Buffer.from(JSON.stringify({eventType, payload: {requestId, restaurants}}))
        try {
            this.producer.produce(
                topicName,
                null,
                message
            )
            callback(null)
        } catch (err) {
            console.log('caught')
            callback(err)
        }
    }
}

// const kafkaProducer = new KafkaProducer(process.env.KAFKA_CREDENTIALS)
const kafkaProducer = new KafkaProducer(process.env.BOOTSTRAP_SERVERS,
                                        process.env.SECURITY_PROTOCOL,
                                        process.env.SASL_MECHANISMS,
                                        process.env.SASL_USERNAME,
                                        process.env.SASL_PASSWORD, process.env.SSL_CA_LOCATION);
Object.freeze(kafkaProducer)

module.exports = kafkaProducer