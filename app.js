const express = require('express');
const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connect = require('./schemas/index');
connect();

const UserRouter = require('./routers/user');
app.use('/api', UserRouter);

app.listen(port, () => {
    console.log(`listening at http:localhost:${port}`);
});