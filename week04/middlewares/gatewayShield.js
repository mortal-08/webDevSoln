const express = require('express')
const app = express()
let fatalCrashCount = 0
let requestId = 100
let requestCount = {}
setInterval(() => {
    requestId = 100
}, 86400000);
setInterval(() => {
    requestCount = {}
}, 1000);
const reqTagger = (req, res, next) => {
    req.id = "REQ-" + requestId
    console.log(`[Tracking] Request ${req.id} arrived for ${req.method} /user`)
    requestId++
    next()
}

const bhedBhav = (req, res, next) => {
    const role = req.headers['role'] 
    const tier = req.headers['tier']
    req.role = role
    req.tier = tier
    if (!role || !tier) return next(new Error("missing parameters")) //its working as expected like this!!
    const id = req.query.id // a confusion here can i use req.id here if i wrote that middleware above this middleware
    req.userId = id
    if(!id) return next(error)
    if (requestCount[id] === undefined) {
        requestCount[id] = 1
    } else {
        requestCount[id]++
    }
    const count = requestCount[id]

    // assumes admin has admin tier 
    if(tier === 'admin'){
        return next()
    }
    else if (tier !== 'premium') {
        if (count > 3) return res.status(429).json({ error: "Rate limit exceeded. Slow down." })
        next()
    } else if (tier === 'premium') {
        if (count > 10) return res.status(429).json({ error: "Rate limit exceeded. Slow down." })
        next()}

    
}

app.use(reqTagger)
app.use(bhedBhav)
app.use(express.json())


// Test Route 1: Normal Operation
app.get("/api/data", (req, res) => {
    res.json({ status: "success", processingFor: req.id });
});

// Test Route 2: Simulates an internal system exception
app.get("/api/crash", (req, res) => {
    console.log(undefined_var)
    res.send("This will never execute.");
});

app.use((err, req, res, next) => {
    if (!req.role || !req.tier||!req.userId||err.type ==='entity.parse.failed') return res.status(400).json({ msg: "Bad Request JSON payload" })
    next(err)
})
app.use((err, req, res, next) => {
    fatalCrashCount++
    res.status(500).json({
        error: "Internal Financial Engine Fault",
        id: req.id
    })

}
)
app.listen(3000,()=>{console.log("SERVER RUNNING")})



//Refined Code
const express = require('express');
const app = express();

// --- STATE MANAGEMENT ---
let fatalCrashCount = 0;
let requestCounter = 100;
let rateLimitTracker = {};

// Cache Eviction Loops
setInterval(() => { requestCounter = 100; }, 86400000);
setInterval(() => { rateLimitTracker = {}; }, 1000);

// --- 1. TELEMETRY MIDDLEWARE ---
const gatewayTelemetry = (req, res, next) => {
    req.id = `REQ-${requestCounter++}`;
    console.log(`[TRACKING] Request ${req.id} arrived for ${req.method} ${req.url}`);
    next();
};

// --- 2. TRAFFIC SHAPING MIDDLEWARE ---
const dynamicRateLimiter = (req, res, next) => {
    const role = req.headers['role'];
    const tier = req.headers['tier'];
    const userId = req.headers['user-id']; // Stable identifier

    // Attach to request for the error handlers to read later
    req.clientMeta = { role, tier, userId };

    if (!role || !tier || !userId) {
        // Explicit, controlled error injection
        return next(new Error("Missing authentication headers")); 
    }

    if (role === 'admin') return next();

    // Track the stable user ID
    rateLimitTracker[userId] = (rateLimitTracker[userId] || 0) + 1;
    const hits = rateLimitTracker[userId];

    if (tier === 'premium' && hits > 10) {
        return res.status(429).json({ error: "Rate limit exceeded. Slow down." });
    } else if (tier !== 'premium' && hits > 3) {
        return res.status(429).json({ error: "Rate limit exceeded. Slow down." });
    }

    next();
};

// --- ASSEMBLY LINE MOUNTING ---
app.use(gatewayTelemetry);
app.use(dynamicRateLimiter);
// Placed AFTER the limiter to save CPU on blocked requests, but BEFORE routes
app.use(express.json()); 

// --- ROUTES ---
app.get("/api/data", (req, res) => {
    res.json({ status: "success", processingFor: req.id });
});

app.get("/api/crash", (req, res) => {
    console.log(undefined_database_connection); // Simulating catastrophic failure
    res.send("This will never execute.");
});

// --- THE POLYMORPHIC SAFETY NET ---

// Scenario A: Client Payload/Header Faults
app.use((err, req, res, next) => {
    const isMissingHeaders = err.message === "Missing authentication headers";
    const isMalformedJSON = err.type === 'entity.parse.failed';

    if (isMissingHeaders || isMalformedJSON) {
        return res.status(400).json({ error: "Bad Request: Invalid Payload or Headers" });
    }
    
    // If it's not a client error, pass it down to the critical failure net
    next(err);
});

// Scenario B: Internal System Faults
app.use((err, req, res, next) => {
    fatalCrashCount++;
    console.error(`[CRITICAL FAULT] ${req.id} - ${err.message}`); // Log the actual stack trace for DevOps, not the user
    
    res.status(500).json({
        error: "Internal Financial Engine Fault",
        incidentId: req.id
    });
});

app.listen(3000, () => console.log("Gateway Shield Active on Port 3000"));