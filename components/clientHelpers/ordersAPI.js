async function createOrder(order) {
    if (STATIC_DATA) {
        console.log(STATIC_DATA)
        return new Promise(resolve => {
            resolve("noop")
        })
    } else {
        let jsonBodyRequest = {...order, kitchenSpeed: 1000, courierSpeed: 1000}
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