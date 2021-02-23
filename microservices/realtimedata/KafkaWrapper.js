const Kafka = require('node-rdkafka');

class KafkaWrapper {
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
            'log.connection.close' : false,
            'enable.auto.commit': false
        };
        let consumerConfig = {
            // 'client.id': 'orderconsumer',+ UUID?
            'group.id': 'realtimedata-consumer-group',
        }

        for (var key in driver_options) {
            consumerConfig[key] = driver_options[key]
        }

        // create kafka consumer
        let topicConfig = {
            'auto.offset.reset': 'earliest'
        }
        let consumer = new Kafka.KafkaConsumer(consumerConfig, topicConfig)

        // Register error listener
        consumer.on('event.error', function(err) {
            console.error('Error from consumer:' + JSON.stringify(err));
        });

        this.consumer = consumer
    }
  
    on(event, callback) {
      this.consumer.on(event, callback)
    }
}

const kafkaWrapper = new KafkaWrapper(process.env.KAFKA_CREDENTIALS)
Object.freeze(kafkaWrapper)

module.exports = kafkaWrapper