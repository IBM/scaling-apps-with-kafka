const axios = require('axios').default;

function payloadToRequestBody(payload, eventType) {
    let message;
    if (eventType == "orderCreated") {
        message = "A new order of " + payload.dish + " has been placed."
    } else if (eventType == "delivered") {
        message = "Delivered! " + payload.dish + " has been delivered."
    }
    return {
        payload: payload,
        kitchenId: payload.kitchenId,
        message
    }
}

function notifyOnCallbackURL(url, body) {
    return axios.post(url, body);
}
module.exports = {
    notifyOnCallbackURL,
    payloadToRequestBody
}