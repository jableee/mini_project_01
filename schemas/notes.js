const mongoose = require('mongoose');

const noteSchemas = new mongoose.Schema({
    note_id:{
        type: Number,
        required: true,
        unique: true,
    },
    note_title: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
    },
    // note_image: {
    //     type: Image,
    // },
    // note_memos: [{
    //     memo_id: {
    //         // 30개의 칸을 보여주는 부분인데 여기서 뭘 보여줘야하지...
    //     }
    // }]
})

module.exports = mongoose.model('Note', noteSchemas);