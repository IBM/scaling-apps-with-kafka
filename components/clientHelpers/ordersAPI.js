async function createOrder(order, config, sendOnly) {
    if (STATIC_DATA) {
        console.log(STATIC_DATA)
        return new Promise(resolve => {
            resolve("noop")
        })
    } else {
        let temp = config || {}
        let kitchenSpeed = temp.kitchenSpeed || 1000, courierSpeed = temp.courierSpeed || 1000
        let jsonBodyRequest = {...order, kitchenSpeed, courierSpeed}
        let invocationRequest = await fetch(API_URL.concat("/createOrder"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonBodyRequest)
        })
        let invocationResponse = await invocationRequest.json()
        let invocationId = invocationResponse.requestId
        let count = 10 // 10 tries
        if (sendOnly) {
            count = 0
            return invocationResponse
        }
        while (count > 0) {
            let inlineDelay = await new Promise(resolve => setTimeout(resolve, 250)) // 250ms
            statusRequest = await fetch(API_URL.concat("/status/").concat(invocationId))
            statusJson = await statusRequest.json()
            if (statusJson.status != "processing") {
                return {...statusJson, ...invocationResponse}
            }
            count--
        }
    }
}

async function getOrdersOfUser(userId) {
    if (STATIC_DATA) {
        console.log(STATIC_DATA)
        return new Promise(resolve => {
            resolve("noop")
        })
    } else {
        let invocationRequest = await fetch(API_URL.concat(`/user/${userId}/orders`))
        let invocationResponse = await invocationRequest.json()
        let invocationId = invocationResponse.requestId
        let count = 10 // 10 tries
        while (count > 0) {
            let inlineDelay = await new Promise(resolve => setTimeout(resolve, 250)) // 250ms
            statusRequest = await fetch(API_URL.concat("/status/").concat(invocationId))
            statusJson = await statusRequest.json()
            if (statusJson.status != "processing") {
                return statusJson
            }
            count--
        }
    }
}