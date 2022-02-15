const express = require('express');
const app = express();
const port = 5000;
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/post', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'conection error'));

const bodyParser = require('body-parser');

const connect = require('./schemas/user');
connect ();

app.use(bodyParser.json());
// app.use(express.urlencoded({ extened: false }));

const user = require('./routers/user');

app.use('/api', user);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});