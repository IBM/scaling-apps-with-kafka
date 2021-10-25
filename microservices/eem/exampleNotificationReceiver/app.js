const express = require('express');
const app = express();
const cors = require('cors');
const Redis = require('ioredis');
const redis = new Redis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    db: 1
});

const channel = process.env.REDIS_CHANNEL || "notification-pubsub"

const PORT = process.env.PORT || 8080

app.use(express.json());
app.use(cors());

// example callback to receive notification
app.post("/callback", (req, res) => {
    // req.body.message is the notification
    // req.body.kitchenId
    // req.body.payload
    if (req.body && req.body.kitchenId && req.body.payload) {
        let response_data = {
            data: {
                message_sent: req.body.message,
                status: "message_sent"
            },
            status: 200
        }
        redis.publish(channel, JSON.stringify(response_data));
        res.status('200').send(response_data);
    } else {
        res.status('404').send("Invalid Request body.");
    }
});

// redis subscribe will send to websocket
module.exports = {
    app
}