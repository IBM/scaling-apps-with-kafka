const k8s = require('@kubernetes/client-node');
const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 8080


const k8sApi = k8s.Config.fromCluster()
let intervalMs = process.env.K8S_POD_INTERVAL || 10000

app.use(express.json());
app.use(cors())

let resArrays = []

let getConsumerCountInterval = null
function toggleInterval(flag) {
    if (flag) {
        getConsumerCountInterval = setInterval(() => {
            k8sGetPods(stats => {
                resArrays.forEach(obj => {
                    obj.res.write('data: ' + JSON.stringify(stats) + '\n\n')
                })
                if (resArrays.length == 0) {
                    clearInterval(getConsumerCountInterval)
                    getConsumerCountInterval = null
                }
            })
        }, intervalMs)
    } else {
        clearInterval(getConsumerCountInterval)
        getConsumerCountInterval = null
    }
}

function k8sGetPods(callback) {
    k8sApi.listNamespacedPod('food-delivery').then(res => {
        // console.log(res.body.items)
        
        // console.log(res.body.items[0].metadata)
        // console.log(res.body.items[0].spec)
        // console.log(res.body.items[0].status)
        let ordersconsumers, kitchenconsumers, courierconsumers, statusconsumers
        let stats = {
            ordersconsumers,
            kitchenconsumers,
            courierconsumers,
            statusconsumers
        }
        stats.ordersconsumers = 0,
        stats.kitchenconsumers = 0,
        stats.courierconsumers = 0,
        stats.statusconsumers = 0
        res.body.items.forEach(pod => {
            if (pod.metadata?.name?.includes('orders-')) {
                stats.ordersconsumers++
            } else if (pod.metadata?.name?.includes('kitchen-')) {
                stats.kitchenconsumers++
            } else if (pod.metadata?.name?.includes('courier-')) {
                stats.courierconsumers++
            } else if (pod.metadata?.name?.includes('status-')) {
                stats.statusconsumers++
            }
        })
        console.log(stats)
        callback(stats)
    }).catch(err => {
        console.log(err)
    })
}

app.get('/consumers', (req, res) => {
    res.writeHead(200, {
        'Content-type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-control': 'no-cache'
    })
    let resId = uuidv4()

    if (!getConsumerCountInterval) {
        toggleInterval(true)
    }

    resArrays.push({
        resId,
        res
    })

    req.on('close', () => {
        console.log('closed connection: ' + resId)
        resArrays = resArrays.filter(obj => obj.resId !== resId)
    })
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});