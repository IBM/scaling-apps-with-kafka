const express = require('express');
const app = express();
const cors = require('cors');
const Redis = require('ioredis');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const redis = new Redis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    db: 1
});

const BACKEND_URL = process.env.BACKEND_URL

app.use(express.json());
app.use((err, req, res, next) => {
    if (err) {
        if (err.type == "entity.parse.failed") {
            res.status(400).send("Invalid JSON.");
        } else {
            res.status(400).send(err.type)
        }
    } else {
        next();
    }
})
app.use(cors());
app.use('/dashboard', express.static('dashboard'));

app.get("/backend_url", (req, res) => {
    res.send(BACKEND_URL);
});

// result is callback url for kitchen
app.get("/notification/:kitchenId", (req, res) => {
    let kitchenId = req.params.kitchenId
    if (!uuidValidate(kitchenId)) {
        res.status('404').send('Invalid KitchenID format');
        return;
    }
    redis.get(kitchenId).then(result => {
        if (result) {
            res.status('200').send(result);
        } else {
            res.status('404').send('Kitchen not found.');
        }
    }).catch(err => {
        console.log(err)
        res.status('404').send(err);
    });
});


// value is callback url
app.post("/notification/:kitchenId", (req, res) => {
    let kitchenId = req.params.kitchenId
    let value = req.body.url // TODO: add url validation
    let url
    try {
        url = new URL(value);
    } catch {
        res.status('404').send('Invalid URL.');
    }
    if (!url) return;
    redis.get(kitchenId).then(result => {
        redis.set(kitchenId, value);
    }).catch(err => {
        console.log(err)
    });
    res.status('200').send('OK');
});

module.exports = {
    app,
    redis,
    disconnect: (done) => {
        redis.disconnect(false);
        done();
    }
}