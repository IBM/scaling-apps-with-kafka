const Kafka = require('node-rdkafka');

class KafkaProducer {
    constructor(ibmcloud_credentials) {
        // ibm cloud service credentials
        let jsonCredentials = JSON.parse(ibmcloud_credentials)
        let brokers = jsonCredentials.kafka_brokers_sasl
        let apiKey = jsonCredentials.api_key
        // producer
        let driver_options = {
            //'debug': 'all',
            'metadata.broker.list': brokers,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'PLAIN',
            'sasl.username': 'token',
            'sasl.password': apiKey,
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

        // debug
        // producer.on('event.log', function(log) {
        //     console.log(log);
        // });

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
}

const kafkaProducer = new KafkaProducer(process.env.KAFKA_CREDENTIALS)
Object.freeze(kafkaProducer)

module.exports = kafkaProducer