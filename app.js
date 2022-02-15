const express = require('express');

const app = express();
const port = 5000;
// const bodyParser = require('body-parser');

const connect = require('./schemas');
connect ();

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extened: false }));

const mainRouter = require("./routers/note"); //데이터명 정해주기
const user = require('./routers/user');
const memoRouter = require('./routers/memo')
app.use('/api', mainRouter);
app.use('/api', user);
app.use('/api', memoRouter);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
