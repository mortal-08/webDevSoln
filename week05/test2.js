const express = require('express');
const app = express();
app.use(express.json());
app.post('/', (req, res, next) => {
    console.log("BODY IS", req.body);
    const a = parseFloat(req.body.a);
    if (Number.isNaN(a)) {
        return next(new Error('invalid data'));
    }
    res.send('ok');
});
app.use((err, req, res, next) => {
    console.log("ERR TYPE:", err.type, "ERR MSG:", err.message);
    if (err.message === 'invalid data') return res.status(400).send('invalid');
    res.status(500).send('err');
});
app.listen(3002, () => console.log("listening"));
