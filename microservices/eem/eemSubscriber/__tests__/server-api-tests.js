const request = require("supertest");
const {app, disconnect} = require("../app");

jest.mock('ioredis', () => require('ioredis-mock/jest'));

describe("Test REST APIs", () => {

    test("GET Path '/' should return 404", async () => {
        let response = await request(app).get("/");
        expect(response.statusCode).toBe(404);
    });

    test("GET '/notification/123' with INVALID UUID should return 404.", async () => {
        let response = await request(app).get("/notification/123");
        expect(response.statusCode).toBe(404);
    });

    test("GET '/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4' should return 404 Kitchen ID not found.", async () => {
        let response = await request(app).get("/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4");
        expect(response.text).toBe('Kitchen not found.');
        expect(response.statusCode).toBe(404);
    });

    test("POST '/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4' with INVALID JSON should return 404 Invalid JSON.", async () => {
        let response = await request(app)
            .post("/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4")
            .send('{url: "http://example.org"}')
            .set('Content-type', 'application/json');
        expect(response.text).toBe('Invalid JSON.');
        expect(response.statusCode).toBe(400);
    });

    test("POST '/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4' should return 200 OK.", async () => {
        let response = await request(app)
            .post("/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4")
            .send({url: 'http://example.org'})
            .set('Content-type', 'application/json');
        expect(response.text).toBe('OK');
        expect(response.statusCode).toBe(200);
    });

    test("GET '/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4' should return 200 Kitchen ID exists.", async () => {
        let response = await request(app).get("/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4");
        expect(response.text).toBe('http://example.org');
        expect(response.statusCode).toBe(200);
    });

    test("POST '/notification/934e6efc-8773-4a82-b597-af3e7724a27d' should return 404 Invalid URL.", async () => {
        let response = await request(app)
            .post("/notification/8b8d17c8-5823-49bc-b08d-c238eca3aeb4")
            .send({url: 'example.org'})
            .set('Content-type', 'application/json');
        expect(response.text).toBe('Invalid URL.');
        expect(response.statusCode).toBe(404);
    });

    test("GET '/notification/934e6efc-8773-4a82-b597-af3e7724a27d' should return 404 Kitchen ID not found.", async () => {
        let response = await request(app).get("/notification/934e6efc-8773-4a82-b597-af3e7724a27d");
        expect(response.text).toBe('Kitchen not found.');
        expect(response.statusCode).toBe(404);
    });

    afterAll((done) => {
        disconnect(done);
    });
});