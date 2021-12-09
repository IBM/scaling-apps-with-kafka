# Deploying an example scenario with Event Endpoint Management in OpenShift

The previous code pattern [Scaling an Event Driven architecture using an Event Driven autoscaler](https://github.com/IBM/scaling-apps-with-kafka/) walked you through creating a Kafka cluster and creating microservices to interact with it and deploy an example food ordering application. In this code pattern, you will use that code pattern and explore a scenario where you can use Event Endpoint Management. This code pattern explores a scenario where you have 3 entities: **A)** the event producer who owns the Kafka topic. This entity describes and documents their stream of events in the topic and publishes this in a catalog where others can discover and subscribe to it. **B)** The external app developer who will subscribe to that published event stream. This entity will use the API Developer Portal to subscribe to that stream and uses it to get its own credentials for it to access the stream in its own application. **C)** Another entity is a restaurant system administrator, the user of the external app developer's application. In this example code pattern, this entity uses that application to set up webhooks so that its restaurant can be integrated and receive notifications whenever an order is created for its restaurant.

With Event Endpoint Management, this allows an organization or an entity to share its stream of events in a Kafka topic and manage this. Event Endpoint Management uses the AsyncAPI standard specification to define and document the stream of events. This allows developers to discover and easily integrate the stream of events shared by the organization. The developers can then generate and manage their own credentials to consume the stream. Event Endpoint Management is included in [Cloud Pak for Integration](https://www.ibm.com/cloud/cloud-pak-for-integration).

When you have completed this code pattern, you will understand how to:

* Share a Kafka Topic with Event Endpoint Management
* Subscribe to the Event Endpoint AsyncAPI
* Integrate an application to use the Event Endpoint


![architecture](../../docs/images/architecture-eem.png)

## Flow

**1 - 10** in the architecture is the same in the previous code pattern [Scaling an Event Driven architecture using an Event Driven autoscaler](https://github.com/IBM/scaling-apps-with-kafka/).

11. The event producer entity configures the AsyncAPI with Event Endpoint Manager (or API Manager with Event Endpoint capability). The event producer entity publishes this AsyncAPI so that the external app developer can consume the Kafka topic.

12. The external app developer entity subscribes to the AsyncAPI. This entity will get its own Kafka connection through the Event Endpoint gateway.

13. The external app developer deploys its finished app that connects the AsyncAPI endpoint.

14. Another entity, the system administrator of an example restaurant sets up its own environment for its point of sale system.

15. The system administrator uses the external app developer's application to set up its webhook so that it gets notifications for whenever its restaurant gets orders.

16. The restaurant's point of sale system gets notifications from the external app developer's app through webhooks being sent.

# Prerequisites

* OpenShift cluster **(Tested with IBM Cloud and AWS)**
* OpenShift CLI (oc)
* Kafka service **(Tested with IBM Event Streams and Confluent)**
* Cloud Pak for Integration **(with Event Endpoint capability)**

Make sure you are logged in your target openshift cluster when you are doing `oc` commands in this code pattern.

# Steps

1. [Clone the repo](#1-clone-the-repo).
2. [Configure Event Endpoint Management](#2-Configure-Event-Endpoint-Management).
3. [Subscribe to Event Endpoint AsyncAPI](#3-Subscribe-to-Event-Endpoint-AsyncAPI).
4. [Create Secrets](#4-Create-Secrets)
5. [Deploy the microservices](#5-Deploy-the-microservices).
6. [Run the application](#6-Run-the-application).


### 1. Clone the repo

Clone the `scaling-apps-with-kafka` repo locally and go to the `eem` directory. In a terminal, run:

```bash
git clone https://github.com/IBM/scaling-apps-with-kafka

cd microservices/eem
```

### 2. Configure Event Endpoint Management
This code pattern assumes you already have an API Manager with Event Endpoint capabilities or a standalone Event Endpoint Manager in your [Cloud Pak for Integration](https://www.ibm.com/cloud/cloud-pak-for-integration) installation.

First, you will need to go to your API Manager or Event Endpoint Management dashboard and add an AsyncAPI:
![create-async-api](../../docs/images/create-async-api.png)

Configure it with your own Kafka instance. This code pattern has been tested with Confluent and IBM Event Streams services. You can name it `Example Food Delivery` for this code pattern.
![async-api-config](../../docs/images/async-api-configuration.png)

Click on **Next** then check the `Publish this API:` so that a product can easily be created for you and it should automatically publish this in the available AsyncAPIs to use in the API portal.
![async-api-config](../../docs/images/async-api-configuration-publish.png)

You should see a summary of your AsyncAPI similar to the image below.
![async-api-config](../../docs/images/async-api-configuration-summary.png)

### 3. Subscribe to Event Endpoint AsyncAPI
To subscribe to the Event Endpoint, you will need to use the API Developer Portal. Make sure you're logged in.
![api-portal](../../docs/images/api-portal.png)

Click on the `API Products` page. You should be able to see the product that was automatically created for the AsyncAPI from the previous step. Click on that one.
![api-portal](../../docs/images/api-products.png)

From the `Plans` section, click the `Select` button to subscribe to it.
![api-portal](../../docs/images/api-product-plan.png)

Select the `Create application` to create a new application for the subscription. You should also see your `Key` and `Secret`. **Take note of this for the next step. Copy it somewhere in your text editor**. Proceed with the subscription prompts by selecting your newly created app.
![api-portal](../../docs/images/api-product-subscribe.png)
![api-portal](../../docs/images/api-product-api-key-secret.png)
![api-portal](../../docs/images/api-product-subscribe-selected.png)

Then back in the Products section, select the AsyncAPI to view its endpoint.
![api-portal](../../docs/images/api-product-select.png)

Take note of the `Endpoint` value you get similar to the screenshot above. _The value from the example above is `apim-demo-egw-event-gw-client-cp4i-apic.apps.biggs.coc-ibm.com:443`_. Copy it somewhere in your text editor as you will also need this for the next step.

![api-portal](../../docs/images/api-product-gateway.png)

Then, you will also need the client ID. You can get this by going to the `orders` > `Subscribe (operation)` from the API product page. On the `Properties` section, you can find your client ID in `client.id`. Take note of this as well for the next step.

![api-portal](../../docs/images/api-product-client-id.png)

### 4. Create Secrets

For this step, you should already have an `Endpoint`,`Key`, `Secret`, `ClientID` values. In `asyncapi-secret.yaml`, replace the values of `BOOTSTRAP_SERVERS`, `SASL_USERNAME`, `SASL_PASSWORD`, `CLIENT_ID` with your values respectively. Example is provided below:

```
## example asyncapi-secret.yaml
...
  stringData:
    BOOTSTRAP_SERVERS: 'apim-demo-egw-event-gw-client-cp4i-apic.apps.biggs.coc-ibm.com:443'
    SASL_USERNAME: 'e8d56f43aa5f39aaabe363d3f943f95f'
    SASL_PASSWORD: '678c7105c2c7c3fd4555df0c35197164'
    CLIENT_ID: 'ddc9b04f-9ac6-4dd9-a331-b1798a959931'
...
```

Create the secret using the oc cli:
```
oc create -f asyncapi-secret.yaml
```

<!-- Create secret for username -->
### 5. Deploy the microservices
In this step you can either use the prebuilt images in the yaml files or you can build and push from source on your own Docker Hub. You can follow the instructions here to [build your own container images](building-container-images.md).

Modify the environment variable `BACKEND_URL` in `eem-subscriber.yaml` to use the backend URL from the previous [Scaling an Event Driven architecture using an Event Driven autoscaler](https://github.com/IBM/scaling-apps-with-kafka/) code pattern (Refer to the route you got in [Step 6](https://github.com/IBM/scaling-apps-with-kafka/#6-run-the-application) in that code pattern). Then, you can now deploy the microservice that will consume the Event Endpoint Management connection.

```
oc apply -f eem-subscriber.yaml
```

Then deploy the microservice that has a webhook for an example restaurant's system or point of sale.

```
oc apply -f example-restaurant-pos.yaml
```

Expose both applications with OpenShift routes:
```
oc expose svc/external-app-eem-subscriber
http://external-app-eem-subscriber-food-delivery.***.cloud

oc expose svc/example-restaurant-pos
http://example-restaurant-pos-food-delivery.***.cloud
```

Take note of these URLs for the next step.

### 6. Run the application

Now, you can run the external app developer's app `external-app-eem-subscriber` and use that to set a webhook for a restaurant. In your browser, open the route for the `external-app-eem-subscriber` + `/dashboard` path that you got from the previous step (ex. `http://<route>/dashboard`). Select one of the restaurants, and then for the webhook, use the route of the `example-restaurant-pos` with the path `/callback` (ex. `http://<route>/callback`).

![external-app-eem-subscriber](../../docs/images/eem-subscriber-webhook.png)

Open the route for the `example-restaurant-pos`. It should show a blank dashboard at first.

![example-restaurant-pos](../../docs/images/blank-pos.png)

Go to the previous code pattern's application [Scaling an Event Driven architecture using an Event Driven autoscaler](https://github.com/IBM/scaling-apps-with-kafka/) ([Step 6](https://github.com/IBM/scaling-apps-with-kafka/#6-run-the-application)) and then **create an order in the same restaurant you chose to set a webhook for**. This way, the external app developer's `external-app-eem-subscriber` app would pick that event up and know which webhook to send a notification to. Then, the restaurant's `example-restaurant-pos` dashboard should show this like in the example below:

![example-restaurant-pos](../../docs/images/pos-ordered.png)

## License

This code pattern is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
