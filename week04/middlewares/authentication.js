const express = require('express');
const app = express();

const authMiddleware = (req, res, next) => {
    console.log("Checking Authorization...");
    const isAdmin = true; // Simulating a standard user
    
    if (!isAdmin) {
        res.status(403).send("Forbidden: Admins only.");
    }
    else{
        next()
    }
  
};

app.get("/dashboard", authMiddleware, (req, res) => {
    console.log("Sending Dashboard Data...");
    res.send("Welcome to the Secret Dashboard");
});

app.listen(3000, () => console.log("Server running"));