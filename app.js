const express = require('express');
const app = express();
const port = 5000;

const connect = require('./schemas');
connect ();

app.use(bodyParser.json());
app.use(express.urlencoded({ extened: false }));

