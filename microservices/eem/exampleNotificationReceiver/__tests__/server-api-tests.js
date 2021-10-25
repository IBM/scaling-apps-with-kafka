const request = require("supertest");
const {app} = require("../app");

jest.mock('ioredis', () => require('ioredis-mock/jest'));

describe("Test REST APIs", () => {
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

    test("POST '/callback' with VALID request body should return 200 example_response (orderCreated)", async () => {
        let response = await request(app)
            .post("/callback")
            .send(example_request_body)
            .set('Content-type', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(example_response);
    });


    test("POST '/callback' with VALID request body should return 200 example_response (delivered)", async () => {
        
        example_request_body.message = "Delivered! " + example_payload.payload.dish + " has been delivered.";
        example_response.data.message_sent = example_request_body.message;
        let response = await request(app)
            .post("/callback")
            .send(example_request_body)
            .set('Content-type', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(example_response);
    });

    test("POST '/callback' with INVALID request body should return 404", async () => {
        let response = await request(app)
            .post("/callback")
            .send({foo: "bar"})
            .set('Content-type', 'application/json');

        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("Invalid Request body.");
    });
});