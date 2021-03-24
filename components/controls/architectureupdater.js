let architectureElement = document.getElementsByTagName('architecture-element')[0]

// test random
// setInterval(() => {
//     architectureElement.setAttribute('statusworkers', Math.floor((Math.random() * 5) + 1))
//     architectureElement.setAttribute('kitchenworkers', Math.floor((Math.random() * 5) + 1))
//     architectureElement.setAttribute('orderworkers', Math.floor((Math.random() * 5) + 1))
//     architectureElement.setAttribute('driverworkers', Math.floor((Math.random() * 5) + 1))
// },5000)

let eventSource = new EventSource('/consumers')
eventSource.onmessage = ({ data }) => {
    if (data) {
        try {
            let parsedData = JSON.parse(data)
            architectureElement.setAttribute('statusworkers', parsedData.statusconsumers)
            architectureElement.setAttribute('kitchenworkers', parsedData.kitchenconsumers)
            architectureElement.setAttribute('orderworkers', parsedData.ordersconsumers)
            architectureElement.setAttribute('driverworkers', parsedData.courierconsumers)
            architectureElement.updateArchitecture()
        } catch (err) {
            console.error(err)
        }
    }
}

function getOffsetsConsumerGroups() {
    // refactor server to SSE
    // listen to socket
    let loc = window.location;
    let wsurl = "ws://" + loc.host + loc.pathname + "events/consumergroupsoffset"
    // let wsurl = "ws://localhost:8080/events/consumergroupsoffset"
    const socket = new WebSocket(wsurl);
    socket.addEventListener('message', function (event) {
        try {
            let eventObject = JSON.parse(event.data)
            // console.log(eventObject)
            architectureElement.setAttribute('statusworkers-offsetdifference', eventObject.status)
            architectureElement.setAttribute('kitchenworkers-offsetdifference', eventObject.kitchen)
            architectureElement.setAttribute('orderworkers-offsetdifference', eventObject.orders)
            architectureElement.setAttribute('driverworkers-offsetdifference', eventObject.courier)
            architectureElement.updateArchitecture()
            // calculate consumed messages per second per consumer group?
        } catch (err) {
            console.error(err)
        }
    });
}

getOffsetsConsumerGroups()