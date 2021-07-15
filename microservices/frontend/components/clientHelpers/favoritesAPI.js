
async function getFavoriteRestaurants() {
    if (STATIC_DATA) {
        // return await fetch('./components/restaurants.json')
        return new Promise(resolve => {
            resolve("noop")
        })
    } else {
        try {
            let fetchrequest = await fetch(API_URL.concat("/favorites/sync"))
            let fetchresponse = await fetchrequest.json()
            console.log(fetchresponse)
            return fetchresponse
        } catch (error) {
            throw error
        }
    }
}
function socketFavoriteRestaurants(callback) {
    // listen to socket
    let loc = window.location;
    let wsurl = "ws://" + loc.host + loc.pathname + "favorites"
    // let wsurl = "ws://example-food-demo.anthonyamanse-4-5-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud/favorites"
    const socket = new WebSocket(wsurl);
    socket.addEventListener('message', function (event) {
        try {
            let dataObject = JSON.parse(event.data)
            callback(dataObject)
        } catch (err) {
            console.error(err)
        }
    });
}