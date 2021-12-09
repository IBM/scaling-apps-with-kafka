async function getRestaurants(delayBetweenRequests, backend_url) {
    delayBetweenRequests = delayBetweenRequests === undefined ? 250 : delayBetweenRequests
    backend_url = backend_url === undefined ? '' : backend_url
    // console.log(delayBetweenRequests)
    let invocationRequest = await fetch(backend_url + '/restaurants')
    let invocationResponse = await invocationRequest.json()
    let invocationId = invocationResponse.requestId
    let count = 10 // 10 tries
    // console.log(invocationResponse)
    while (count > 0) {
        let inlineDelay = await new Promise(resolve => setTimeout(resolve, delayBetweenRequests)) // 250ms
        statusRequest = await fetch(backend_url + "/status/".concat(invocationId))
        statusJson = await statusRequest.json()
        if (statusJson.status != "processing") {
            // console.log(statusJson)
            return statusJson.docs
        }
        count--
    }
    return "Failed to get restaurants list in 10 tries"
}

async function getBackendURL() {
    let invocationRequest = await fetch("/backend_url")
    let backend_url = await invocationRequest.text()
    return backend_url
}

function showRestaurants(container, restaurants) {
    restaurants.forEach(element => {
        let optionElement = document.createElement('option');
        optionElement.value = element.kitchenId;
        optionElement.text = element.name;
        container.appendChild(optionElement);
    })
}

async function saveWebhook(kitchenId, webhook) {
    let saveWebhookRequest = await fetch('/notification/' + kitchenId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: webhook})
    });
    let saveWebhookResponse = await saveWebhookRequest.text();
    return saveWebhookResponse;
}

async function getCurrentWebhook(kitchenId) {
    let currentWebhookRequest = await fetch('/notification/' + kitchenId);
    let currentWebhook = await currentWebhookRequest.text();
    return currentWebhook;
}

module.exports = {
    getRestaurants,
    showRestaurants
}