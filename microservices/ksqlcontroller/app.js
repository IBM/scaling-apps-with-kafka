const { response } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
// const needle = require('needle');
const http2 = require('http2');
const WebSocket = require('ws');
const url = require('url');
const wss = new WebSocket.Server({ noServer: true });

const PORT = process.env.PORT || 8080

const KSQL_ENDPOINT = process.env.KSQL_ENDPOINT
const KSQL_API_KEY = process.env.KSQL_API_KEY
const KSQL_API_SECRET = process.env.KSQL_API_SECRET
const KSQL_STATEMENT = process.env.KSQL_STATEMENT || "select ROWTIME, kitchenId, count from favoriteRestaurants EMIT CHANGES;"

app.use(express.json());
app.use(cors())

let favoritesMap = new Map()
let mostRecentDataTimesamp;
let lastDataSendTimestamp;

wss.on('connection', (ws, req) => {
    ws.PATHNAME = req.url
    // send current map on connect
    ws.send(JSON.stringify({favorites: Object.fromEntries(favoritesMap), timestamp: mostRecentDataTimesamp}))
})

function queryStream(sql_statement) {
    // change sql to use param
    // add LIMIT to sql statement for scalability?
    let params = {
        "sql": KSQL_STATEMENT,
        "streamsProperties": {}
    }
    
    var auth = 'Basic ' + Buffer.from(KSQL_API_KEY + ':' + KSQL_API_SECRET).toString('base64');
    let buffer = Buffer.from(JSON.stringify(params))
    const connection = http2.connect(KSQL_ENDPOINT + '/query-stream')
    const stream = connection.request({
        ':method': 'POST',
        ':path': '/query-stream',
        'authorization': auth,
        'Content-Length': buffer.length
    }, { endStream: false })

    stream.on('response', (headers) => {
        console.log('RESPONSE', headers)
    })
    
    stream.on('data', (data) => {
        console.log('DATA', data.toString())
        try {
            let dataJSON = JSON.parse(data.toString())

            // check if header
            if (dataJSON.queryId != null) {
                console.log("found ksql query header")
            }
            
            // check for data
            if (Array.isArray(dataJSON)) {
                console.log("found row")
                // column dish is index 1
                let kitchenId = dataJSON[1]
                let count = dataJSON[2]
                favoritesMap.set(kitchenId, count)
                console.log(favoritesMap)
                mostRecentDataTimesamp = Date.now()
            }
        } catch (err) {
            console.error(err)
        }
    })

    stream.on('end', () => {
        console.log('END HTTP/2 STREAM')
        console.log('Starting another http/2 stream')
        queryStream("")
    })

    stream.end(JSON.stringify(params));
}

app.get("/favorites/sync", (req, res) => {
    res.status('200').send({favorites: Object.fromEntries(favoritesMap), timestamp: mostRecentDataTimesamp})
})

let server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

let intervalPublishWebsocket = setInterval(() => {
    if (Object.keys(Object.fromEntries(favoritesMap)).length == 0) {
        return
    }
    // send only new data
    if (lastDataSendTimestamp < mostRecentDataTimesamp || (lastDataSendTimestamp == null || mostRecentDataTimesamp == null)) {
        lastDataSendTimestamp = mostRecentDataTimesamp
    } else {
        return
    }
    let message = JSON.stringify({favorites: Object.fromEntries(favoritesMap), timestamp: lastDataSendTimestamp})
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.PATHNAME === '/favorites') {
            client.send(message);
        }
    })
}, 1000)

let intervalSendDataEveryMinute = setInterval(() => {
    if (Object.keys(Object.fromEntries(favoritesMap)).length == 0) {
        return
    }
    // send data every minute
    let message = JSON.stringify({favorites: Object.fromEntries(favoritesMap), timestamp: mostRecentDataTimesamp})
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.PATHNAME === '/favorites') {
            client.send(message);
        }
    })
}, 60000)

// accept websocket only when data is available
server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;
    console.log(pathname)

    // if (Object.keys(Object.fromEntries(favoritesMap)).length == 0) {
    //     socket.destroy()
    //     return;
    // }
    if (pathname === '/favorites') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

queryStream("")