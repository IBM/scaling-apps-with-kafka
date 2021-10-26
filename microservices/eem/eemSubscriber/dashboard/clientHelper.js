async function getRestaurants(delayBetweenRequests) {
    delayBetweenRequests = delayBetweenRequests === undefined ? 250 : delayBetweenRequests
    // console.log(delayBetweenRequests)
    let invocationRequest = await fetch("/restaurants")
    let invocationResponse = await invocationRequest.json()
    let invocationId = invocationResponse.requestId
    let count = 10 // 10 tries
    // console.log(invocationResponse)
    while (count > 0) {
        let inlineDelay = await new Promise(resolve => setTimeout(resolve, delayBetweenRequests)) // 250ms
        statusRequest = await fetch("/status/".concat(invocationId))
        statusJson = await statusRequest.json()
        if (statusJson.status != "processing") {
            // console.log(statusJson)
            return statusJson.docs
        }
        count--
    }
    return "Failed to get restaurants list in 10 tries"
}

function showRestaurants(container, restaurants) {
    restaurants.forEach(element => {
        let optionElement = document.createElement('option');
        optionElement.value = element.kitchenId;
        optionElement.text = element.name;
        container.appendChild(optionElement);
    })
}

module.exports = {
    getRestaurants,
    showRestaurants
}