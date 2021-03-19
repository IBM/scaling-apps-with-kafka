let startbutton = document.getElementById("startbutton")
let resetbutton = document.getElementById("resetbutton")
let loadSimulatorStarted = false
resetbutton.disabled = !loadSimulatorStarted

// set sliders config object
let rateOfOrders, numberOfCouriers, speedOfCouriers, speedOfKitchens
let simulatorConfig = {
    rateOfOrders, numberOfCouriers, speedOfCouriers, speedOfKitchens
}

// get graph element
let graphElement = document.getElementsByTagName('graph-element')[0]

// get sliders
let slidersElement = Array.from(document.getElementsByTagName('slider-element'))

let modifySimulatorConfig = function (title, value) {
    if (title === "rate of orders") {
        simulatorConfig.rateOfOrders = Number(value)
    } else if (title === "speed of couriers") {
        simulatorConfig.speedOfCouriers = Math.floor((101 - (Number(value))) * 5000/100)
    } else if (title === "speed of kitchens") {
        simulatorConfig.speedOfKitchens = Math.floor((101 - (Number(value))) * 5000/100)
    }
}

// add listeners to slider element
slidersElement.forEach(element => {
    // assign default values on connectedcallback
    element.addEventListener('slider-input-connected', e => {
        modifySimulatorConfig(element.title, e.detail.eventData.value)
    })
    element.addEventListener('slider-input-change', e => {
        modifySimulatorConfig(element.title, e.detail.eventData.value)
    })
})

let ordersDataMap = new Map()
let completedOrdersMap = new Map()

let apiRequestInterval
let aggregateDataPerSecondInterval
function startLoadSimulator(start) {
    if (start) {
        clearInterval(apiRequestInterval)
        apiRequestInterval = setInterval(() => {
            // console.log(simulatorConfig)
            let config = {
                kitchenSpeed: simulatorConfig.speedOfKitchens,
                courierSpeed: simulatorConfig.speedOfCouriers
            }
            let counter = 0
            while (counter < simulatorConfig.rateOfOrders) {
                createOrder({}, config, true).then(response => {
                    ordersDataMap.set(response.payloadSent.orderId, Date.now())
                })
                counter++
            }
        }, 1000)
    } else {
        clearInterval(apiRequestInterval)
    }
}

startbutton.addEventListener('click', e => {
    loadSimulatorStarted = true
    if (loadSimulatorStarted) {
        startLoadSimulator(true)
        e.target.disabled = true
        resetbutton.disabled = false
    }
})

resetbutton.addEventListener('click', e => {
    loadSimulatorStarted = false
    if (!loadSimulatorStarted) {
        startLoadSimulator(false)
        e.target.disabled = true
        startbutton.disabled = false
    }
})

// listen to socket
let loc = window.location;
let wsurl = "ws://" + loc.host + loc.pathname + "events"
const socket = new WebSocket(wsurl);

// Listen for messages
socket.addEventListener('message', function (event) {
    try {
        let eventObject = JSON.parse(event.data) // {eventType, payload: order, timestamp}
        let eventType = eventObject.eventType
        let order = eventObject.payload
        // calculate order completion time
        if (eventType === "delivered") {
            if (ordersDataMap.has(order.orderId)) {
                let originalTimestamp = ordersDataMap.get(order.orderId)
                completedOrdersMap.set(order.orderId, eventObject.timestamp - originalTimestamp)
                ordersDataMap.delete(order.orderId)
            }
        }
        // calculate consumed messages per second per consumer group?
    } catch (err) {
        console.error(err)
    }
});

function aggregateData() {
    aggregateDataPerSecondInterval = setInterval(() => {
        let sum = 0
        let averageTimeToComplete = 0
        let size = completedOrdersMap.size
        if (completedOrdersMap.size != 0) {
            for (let timeToComplete of completedOrdersMap.values()) {
                sum += timeToComplete
            }
            averageTimeToComplete = sum / size
        }
        graphElement.data.push(averageTimeToComplete / 1000)
        graphElement.data.shift()
        completedOrdersMap.clear()
    }, 1000)
}
if (STATIC_DATA) {
    setInterval(() => {
        graphElement.data.push(Math.floor(Math.random() * (20) + 40))
        graphElement.data.shift()
    }, 1000)
} else {
    aggregateData()
}