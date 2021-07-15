# Process streams and extract insights with KsqlDB

<!-- intro -->

<!-- ![architecture](docs/images/architecture.png) -->

## Flow

# Prerequisites

* OpenShift cluster
* OpenShift CLI (oc)

Make sure you are logged in your target openshift cluster when you are doing `oc` commands in this code pattern.

# Steps

1. [Complete previous code pattern](#1-Complete-previous-code-pattern).
2. [Create and configure the ksqlDB](#2-Create-and-configure-the-Kafka-service).
3. [Execute KSQL statements](#3-Deploy-the-microservices).
4. [Build microservice that exposes data from ksqlDB](#4-Install-KEDA)
5. [Create ksqlDB credentials then deploy microservice](#5-Deploy-KEDA-ScaledObjects).
6. [Run the application](#6-Run-the-application).

### 1. Complete previous code pattern

This code pattern extends the [Scaling an Event Driven architecture using an Event Driven autoscaler](https://github.com/IBM/scaling-apps-with-kafka/). Complete that code pattern before proceeding to the next step.

### 2. Create and configure the ksqlDB

* Select your Kafka cluster and go to **ksqlDB** section

![ksqlcreate](docs/images/ksqlcreate.png)

* Choose **Create application myself** then **Global Access** for access control. Name your ksqlDB and choose **4 streaming units**

![ksqlname](docs/images/ksqlname.png)

### 3. Execute KSQL statements

Once you have created the ksqlDB application, you may need to wait for it to get provisioned. It could take 5 to 10 minutes. Once provisioned, click on your provisioned ksqlDB then you can now use the editor and execute the ksql statements below.

![editor](docs/images/ksqleditor.png)

* Create a Stream for the orders topic

```
CREATE STREAM ORDERS_EVENTS_STREAMS
	(payload STRUCT <
     	orderId VARCHAR,
     	userId VARCHAR,
     	kitchenId VARCHAR,
     	dish VARCHAR,
     	totalPrice DOUBLE>,
     eventType VARCHAR)	WITH (KAFKA_TOPIC = 'orders', VALUE_FORMAT='JSON');
```

![execute ksql statement](docs/images/executeksql.png)

* Create a Stream where we only get records of an *orderCreated* event.

```
CREATE STREAM ORDERS_CREATED AS
	SELECT PAYLOAD->orderId AS orderId,
    	PAYLOAD->userId AS userId,
        PAYLOAD->kitchenId AS kitchenId,
        PAYLOAD->dish AS dish,
		CONCAT_WS('||',PAYLOAD->kitchenId, PAYLOAD->dish) AS kitchendishkey,
        PAYLOAD->totalPrice AS totalPrice
    FROM ORDERS_EVENTS_STREAMS WHERE EVENTTYPE='orderCreated';
```

* Create a Table to get favorite restaurants based on the stream above.

```
CREATE TABLE favoriteRestaurants AS
    SELECT kitchenId, COUNT() AS count
    FROM ORDERS_CREATED GROUP BY kitchenId;
```

* Verify the streams and table created in the **Flow** tab. It should look like below:

![ksqlflow](docs/images/flow.png)

### 4. Build microservice that exposes data from ksqlDB

To expose the data from ksqlDB, you would need a microservice that fetches data from your ksqlDB. The source code is in `microservices/ksqlcontroller`. The microservice is using Node.js and utilizes the available http/2 [REST API](https://docs.ksqldb.io/en/0.18.0-ksqldb/developer-guide/api/) client.

You can build the container image using Docker:

```
docker build -t YOUR_DOCKER_USERNAME/ksqlcontroller:1.0 microservices/ksqlcontroller

docker push YOUR_DOCKER_USERNAME/ksqlcontroller:1.0
```

### 5. Create ksqlDB credentials then deploy microservice

For this step, you will need to use the Confluent Cloud CLI `ccloud`. You can find the binaries in the **CLI and Tools** section in your Confluent Cloud dashboard. Once you have installed it, you can proceed with the commands below.

![ccloudcli](docs/images/ccloudcli.png)

* Login with your Confluent Cloud account.

```
ccloud login
```

* List your ksqlDB application, you will need your **endpoint** and **id**.

```
ccloud ksql app list -o json

[
  {
    "endpoint": "https://pksqlc-***.***.confluent.cloud:443",
    "id": "lksqlc-***",
    "kafka": "lkc--***",
    "name": "ksqlDB_app_0",
    "status": "UP",
    "storage": "500",
    "topic_prefix": "pksqlc-***"
  }
]
```

* Create an api key for your ksqlDB app. Replace **YOUR_KSQLDB_APP_ID** with the the one you got from the command above.

```
ccloud api-key create --resource YOUR_KSQLDB_APP_ID

It may take a couple of minutes for the API key to be ready.
Save the API key and secret. The secret is not retrievable later.
+---------+------------------------------------------------------------------+
| API Key | YOUR_API_KEY                                                 |
| Secret  | YOUR_SECRET |
+---------+------------------------------------------------------------------+
```

* Take note of the API key and Secret. Go to your `deployments/ksqlcontroller.yaml` and replace the values with your own. You can get the value for **KSQL_ENDPOINT** from the command `ccloud ksql app list -o json` you did above.

* In the same yaml file, replace the image `- image: ` with the one you just built in step 5.

* You can finally deploy the microservice.

```
oc apply -f deployments/ksqlcontroller.yaml
```

### 6. Run the application

# Sample output

## License

This code pattern is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
