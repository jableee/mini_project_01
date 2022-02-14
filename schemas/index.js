const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect('mongodb://localhost:27017/note-memo' ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(err => console.log(err))
};

mongoose.connection.on('error', err => {
    console.log('몽고디비 연결 에러', err)
});

module.exports = connect;