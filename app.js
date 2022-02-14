const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const connect = require('./schemas');
connect ();

app.use(bodyParser.json());
app.use(express.urlencoded({ extened: false }));

const user = require('./routers/user');

app.use('/api', user);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});