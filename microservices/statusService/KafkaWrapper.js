const Kafka = require('node-rdkafka');

class KafkaWrapper {
    constructor(brokers, protocol, mechanism, username, password, ca_location) {
        let jsonCredentials
        try { // if first param is ibmcloud credentials in JSON
            jsonCredentials = JSON.parse(brokers)
        } catch (err) {}
        brokers = jsonCredentials ? jsonCredentials.kafka_brokers_sasl : brokers
        let apiKey = jsonCredentials ? jsonCredentials.api_key:undefined
        let driver_options = {
            //'debug': 'all',
            'metadata.broker.list': brokers,
            'security.protocol': protocol ? protocol:'SASL_SSL',
            'sasl.mechanisms': mechanism ? mechanism:'PLAIN',
            'sasl.username': username ? username:'token',
            'sasl.password': password ? password:apiKey,
            'log.connection.close' : false,
            'enable.auto.commit': false
        };
        let consumerConfig = {
            'client.id': 'status-consumer',
            'group.id': 'status-consumer-group',
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

// const kafkaWrapper = new KafkaWrapper(process.env.KAFKA_CREDENTIALS)
const kafkaWrapper = new KafkaWrapper(process.env.BOOTSTRAP_SERVERS ? process.env.BOOTSTRAP_SERVERS: process.env.EVENT_STREAMS_CREDENTIALS,
                                      process.env.SECURITY_PROTOCOL,
                                      process.env.SASL_MECHANISMS,
                                      process.env.SASL_USERNAME,
                                      process.env.SASL_PASSWORD,
                                      process.env.SSL_CA_LOCATION);
Object.freeze(kafkaWrapper)

module.exports = kafkaWrapper