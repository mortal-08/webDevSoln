const express = require('express')
const cors = require('cors')

const app = express()

// CORS modifier
const corsOptions = {
    origin: 'https://ops.internal-dashboard.com',
    methods: ['POST'],
    credentials: true
}

// Authentication middleware
const requireDevOPSAuth = (req, res, next) => {
    const auth = req.headers['authorization']

    if (!auth || !auth.startsWith('Bearer devops_master_key')) {
        const error = new Error('Unauthorized')
        error.statusCode = 401
        return next(error)
    }

    next()
}

// Global middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(requireDevOPSAuth)

// POST route
app.post('/api/v1/monitor', async (req, res, next) => {
    const linkarr = req.body?.services

    if (!Array.isArray(linkarr) || linkarr.length === 0) {
        const error = new Error('services corrupted')
        error.statusCode = 400
        return next(error)
    }

    try {
        const rawdata = await Promise.allSettled(
            linkarr.map(link =>
                fetch(link, { signal: AbortSignal.timeout(5000) })
                    //formatting each fetch promise
                    .then(res => ({
                        url: link,
                        status: res.ok ? "ONLINE" : "OFFLINE",
                        code: res.status,
                        ok: res.ok
                    }))
            )
        )
        // handling rejected promises
        const organizedData = rawdata.map((obj, index) => {
            if (obj.status === "fulfilled") {
                return obj.value
            } else {
                return {
                    url: linkarr[index],
                    status: "OFFLINE",
                    code: null,
                    reason: obj.reason?.message || 'Unknown Network error'
                }
            }
        })

        return res.status(200).json({ organizedData })
    } catch (err) {
        return next(err)
    }
})

// Global error middleware
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ err: 'malformed json' })
    }

    if (err.message === 'services corrupted') {
        return res.status(400).json({ err: 'services data corrupted' })
    }

    if (err.statusCode === 401 || err.message === 'Unauthorized') {
        return res.status(401).json({ err: 'unauthorized' })
    }

    return res.status(500).json({ err: 'Internal server error' })
})

app.listen(3000)