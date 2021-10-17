let axios = require('axios').default;
const NotifyHelper = require('../sendNotificationHelper');

let example_message = {
    "eventType": "orderCreated",
    "payload": {
        "orderId": "b1e1a549-7187-443e-a9b6-cdc8f16679a9",
        "userId": "a0297e97-202a-44aa-b69e-40b6310c9c5f",
        "kitchenId": "e68a75fa-4861-4635-96f8-4e3ae2d14da2",
        "dish": "10 Alaska Rolls",
        "totalPrice": "30",
        "requestId": "da016387-bc4a-4631-93b9-7f3a16f8e815"
    }
}

jest.mock('axios');
describe("Test Kafka example message", () => {
    let example_response = {
        status: 200,
        data: {
            status: "message_sent",
            message_sent: "A new order of " + example_message.payload.dish + " has been placed."
        }
    }
    axios.post.mockResolvedValue(example_response);
    let requestBody;
    test("Order was created: Convert payload to request body", () => {
         requestBody = NotifyHelper.payloadToRequestBody(example_message.payload, example_message.eventType);
         expect(requestBody.message).toBe("A new order of " + example_message.payload.dish + " has been placed.");
         expect(requestBody.kitchenId).toBe(example_message.payload.kitchenId);
         expect(requestBody.payload).toEqual(example_message.payload);
    });

    test("Order was created: Send notification", () => {
        // Mocked
        return NotifyHelper.notifyOnCallbackURL("http://localhost:8080/callback", requestBody).then(response => {
            expect(response).toBe(example_response);
            expect(response.status).toBe(200);
        });
    });

    test("Order was created: Convert payload to request body", () => {
        example_message.eventType = "delivered"
        requestBody = NotifyHelper.payloadToRequestBody(example_message.payload, example_message.eventType);
        expect(requestBody.message).toBe("Delivered! 10 Alaska Rolls has been delivered.");
        expect(requestBody.kitchenId).toBe(example_message.payload.kitchenId);
        expect(requestBody.payload).toEqual(example_message.payload);
   });

    test("Order was delivered", () => {
        // Mocked
        return NotifyHelper.notifyOnCallbackURL("http://localhost:8080/callback", requestBody).then(response => {
            expect(response).toBe(example_response);
            expect(response.status).toBe(200);
        });
    });
});