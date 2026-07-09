const express = require("express");
const app = express();

// Our In-Memory Database for Rate Limiting
let numberOfRequestsForUser = {};
let errorCount = 0

// The Reset Mechanism: Clears the memory every 1 second
setInterval(() => {
  numberOfRequestsForUser = {};
}, 1000);

// YOUR MIDDLEWARE GOES HERE

const rateLimiter = (req, res, next) => {
  const id = req.headers["user-id"]; 
  if (numberOfRequestsForUser[id] === undefined) {
    numberOfRequestsForUser[id] = 1;
  } else {
    numberOfRequestsForUser[id] += 1;
  }
 if(numberOfRequestsForUser[id]>5)  return res.status(404).send("fuck off dos hacker") 
    next()
};
app.use(rateLimiter)

app.get("/user", function (req, res) {
  console.log(undefined_var)
  res.status(200).json({ name: "john" });
});

app.post("/user", function (req, res) {
  res.status(200).json({ msg: "created dummy user" });
});

const globalErrHandler = (err,req,res,next)=>{
  errorCount += 1
  return res.status(404).json({msg :'something is up with our servers'})
}
app.use(globalErrHandler)
app.listen(3000)