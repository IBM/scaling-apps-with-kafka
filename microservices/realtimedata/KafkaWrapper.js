const Kafka = require('node-rdkafka');

class KafkaWrapper {
    constructor(brokers, protocol, mechanism, username, password) {
        // ibm cloud service credentials
        // let jsonCredentials = JSON.parse(ibmcloud_credentials)
        // let brokers = jsonCredentials.kafka_brokers_sasl
        // let apiKey = jsonCredentials.api_key
        // producer
        // let driver_options = {
        //     //'debug': 'all',
        //     'metadata.broker.list': brokers,
        //     'security.protocol': 'SASL_SSL',
        //     'sasl.mechanisms': 'PLAIN',
        //     'sasl.username': 'token',
        //     'sasl.password': apiKey,
        //     'log.connection.close' : false,
        //     'enable.auto.commit': false,
        //     'statistics.interval.ms': 1000
        // };
        let driver_options = {
            //'debug': 'all',
            'metadata.broker.list': brokers,
            'security.protocol': protocol,
            'sasl.mechanisms': mechanism,
            'sasl.username': username,
            'sasl.password': password,
            'log.connection.close' : false,
            'enable.auto.commit': false,
            'statistics.interval.ms': 1000
        };
        let consumerConfig = {
            'client.id': 'realtimedata-consumer',
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
        // Register stats listener
        // consumer.on('event.stats', function(log) {
        //     console.log('Log from consumer:');
        //     console.log(JSON.parse(log.message))
        // });

        this.consumer = consumer
    }
  
    on(event, callback) {
      this.consumer.on(event, callback)
    }
}
// const kafkaWrapper = new KafkaWrapper(process.env.KAFKA_CREDENTIALS)
const kafkaWrapper = new KafkaWrapper(process.env.BOOTSTRAP_SERVERS,
                                      process.env.SECURITY_PROTOCOL,
                                      process.env.SASL_MECHANISMS,
                                      process.env.SASL_USERNAME,
                                      process.env.SASL_PASSWORD)
Object.freeze(kafkaWrapper)

module.exports = kafkaWrapper