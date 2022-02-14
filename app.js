const express = require('express');
const app = express();  
// const port = 5000; //포트 맞추기


// cors 작성 
// cors use

const connect = require('./schemas');
connect();
app.use(express.urlencoded({extended: false}));
app.use(express.json);

const mainRouter = require("./routers/note"); //데이터명 정해주기

app.use('/api', mainRouter);

app.listen(port, () => {
    console.log(`listening at http://loaclhost:${port}`)
})