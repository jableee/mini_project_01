const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const connect = require('./schemas');
connect ();

app.use(bodyParser.json());
app.use(express.urlencoded({ extened: false }));

const memoRouter = require('./routers/memo');

app.use('/api', memoRouter);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);

});