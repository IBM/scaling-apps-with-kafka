/**
 * @jest-environment jsdom
 */

const request = require("supertest");
const WebSocket = require('ws');
const {app, startServer} = require("../server");
const ClientHelper = require('../example-pos/clientHelper');

jest.mock('ioredis', () => {
    const Redis = require('ioredis-mock');
  
    if (typeof Redis === 'object') {
      // the first mock is an ioredis shim because ioredis-mock depends on it
      // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
      return {
        Command: { _transformer: { argument: {}, reply: {} } },
      };
    }
  
    let instance = null;
  
    // second mock for our code
    return function (...args) {
      if (instance) {
        return instance.createConnectedClient();
      }
  
      instance = new Redis(args);
  
      return instance;
    };
});

const PORT = process.env.PORT || 8080

function waitForSocketState(socket, state) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (socket.readyState === state) {
                resolve();
            } else {
                waitForSocketState(socket, state).then(resolve);
            }
        }, 5);
    });
}
describe("Test Websocket and helper functions", () => {
    let example_payload = {
        "payload": {
            "orderId": "b1e1a549-7187-443e-a9b6-cdc8f16679a9",
            "userId": "a0297e97-202a-44aa-b69e-40b6310c9c5f",
            "kitchenId": "e68a75fa-4861-4635-96f8-4e3ae2d14da2",
            "dish": "10 Alaska Rolls",
            "totalPrice": "30",
            "requestId": "da016387-bc4a-4631-93b9-7f3a16f8e815"
        }
    }
    
    let example_response = {
        status: 200,
        data: {
            status: "message_sent",
            message_sent: "A new order of " + example_payload.payload.dish + " has been placed."
        }
    }

    let example_request_body = {
        message: "A new order of " + example_payload.payload.dish + " has been placed.",
        kitchenId: example_payload.payload.kitchenId,
        payload: example_payload
    }

    let server;
    let client;

    test("Successfully process valid message from server", () => {
        let processedMessage = ClientHelper.processMessage(example_response);
        expect(processedMessage).toEqual({
            status: true,
            message: example_response.data.message_sent
        });
    });
    
    test("should fail to process unknown message from server", () => {
        let unknown_message = { foo: "bar" };
        let processedMessage = ClientHelper.processMessage(unknown_message)
        expect(processedMessage).toEqual({
            status: false,
            reason: 'Unable to process message received from server.',
            message: unknown_message
        });
    });

    test("showMessageDOM should show notification in DOM", () => {
        document.body.innerHTML = `
        <div id="notificationArea">
        </div>
        `;

        const notificationContainer = document.getElementById('notificationArea');
        let example_notification = "A new order of " + example_payload.payload.dish + " has been placed."
        ClientHelper.showMessageDOM(notificationContainer, example_notification);
        let divNotification = document.createElement('div');
        divNotification.className = "notificationText"
        divNotification.innerHTML = example_notification;

        expect(notificationContainer.children[0]).toEqual(divNotification);
    })
}) 