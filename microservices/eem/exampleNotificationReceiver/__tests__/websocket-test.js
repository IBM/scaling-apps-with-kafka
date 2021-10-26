const request = require("supertest");
const WebSocket = require('ws');
const {app, startServer} = require("../server");

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
describe("Test API and Websocket", () => {
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

    beforeAll(async () => {
        server = await startServer();
    });

    test("Websocket client should receive message when POST '/callback' succeeds", async () => {

        client = new WebSocket(`ws://localhost:${PORT}`);
        await waitForSocketState(client, client.OPEN);
        let websocket_message;
        client.on("message", (data) => {
            websocket_message = data.toString();
            client.close();
        });

        // Execute API /callback
        let response = await request(app)
            .post("/callback")
            .send(example_request_body)
            .set('Content-type', 'application/json');


        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(example_response);
        await waitForSocketState(client, client.CLOSED);

        // Test received message from websocket here
        let parsed_message;
        expect(() => {
            try {
                parsed_message = JSON.parse(websocket_message);
            } catch (error) {
                throw new Error("Not JSON parsable: " + websocket_message + "\n Error Message: " + error.message)
            }
        }).not.toThrow();
        expect(parsed_message).toEqual(example_response);
    });

    afterAll((done) => {
        server.close();
        done();
    });
}) 