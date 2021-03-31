function createKitchenList() {

}

async function getKitchenList() {
    if (STATIC_DATA) {
        return await fetch('./components/restaurants.json')
    } else {
        let invocationRequest = await fetch(API_URL.concat("/restaurants"))
        let invocationResponse = await invocationRequest.json()
        let invocationId = invocationResponse.requestId
        let count = 10 // 10 tries
        while (count > 0) {
            let inlineDelay = await new Promise(resolve => setTimeout(resolve, 250)) // 250ms
            statusRequest = await fetch(API_URL.concat("/status/").concat(invocationId))
            statusJson = await statusRequest.json()
            if (statusJson.status != "processing") {
                console.log(statusJson)
                return statusJson.docs
            }
            count--
        }
    }
}