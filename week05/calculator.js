
const express = require('express')
const app = express()

//state variables
let totalReqCount = 0
setInterval(() => { totalReqCount = 0 }, 86400000)


//telemetry pipeline
const reqLogger = (req, res, next) => {
    totalReqCount++
    const now = new Date()
    const timestamp = now.toLocaleTimeString('en-US')
    req.timestamp = timestamp
    console.log(`Request received at ${timestamp} via a ${req.method} from ${req.url}  ip: ${req.ip} and request id:${totalReqCount}`)
    next()
}

app.use(reqLogger)
app.use(express.json())

app.get('/api/v1/metrics', (req, res) => {
    res.status(200).json({
        reqId: totalReqCount,
        url: req.url,
        ip: req.ip,
        timeStamp: req.timestamp,
        method: req.method,
        serverUptimeSeconds: Math.floor(process.uptime()),
        totalRequests: totalReqCount,
        msg: "Total request count goes to 0 every new day. Thanks for visiting"
    })
})

app.post('/api/v1/calculate', (req, res, next) => {
    const operation = req.body.operation
    const validOperations = ["SUM", "SUBTRACT", 'MULTIPLY', 'DIVIDE']
    const a = Number(req.body.a)
    const b = Number(req.body.b)
    if (Number.isNaN(a) || Number.isNaN(b) || !validOperations.includes(operation)) {
        return next(new Error('invalid data'))
    }
    if (operation === "SUM") {
        return res.status(200).json({ result: a + b })
    }
    if (operation === "SUBTRACT") {
        return res.status(200).json({ result: a - b })
    }
    if (operation === "MULTIPLY") {
        return res.status(200).json({ result: a * b })
    }
    if (operation === "DIVIDE") {
        if (b === 0) {
            return res.status(400).json({ msg: "Can't divide by 0" })
        }
        return res.status(200).json({ result: a / b })
    }
})


app.use((err, req, res, next) => {
    console.log("ERROR RECEIVED:", err.message);
    // Check if the error is from express.json() failing to parse bad JSON
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ err: "Invalid JSON format in request body" })
    }
    if (err.message === 'invalid data') {
        return res.status(400).json({ err: "invalid data" })
    }
    return res.status(500).json({ err: "Internal server error" })
})

app.listen(3000)