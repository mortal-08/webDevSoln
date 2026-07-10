const express = require('express');
const app = express();
app.use(express.json());
app.post('/', (req, res, next) => {
    console.log("BODY IS", req.body);
    res.send('ok');
});
app.use((err, req, res, next) => {
    console.log("ERR TYPE:", err.type, "ERR MSG:", err.message);
    res.status(500).send('err');
});
app.listen(3003, () => console.log("listening"));
