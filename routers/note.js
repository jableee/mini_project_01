const express = require('express');
const router = express.Router();
const Note = require('../schemas/notes');
const Memo = require('../schemas/memos');    //메모스키마 확인후 맞추기
const auth = require('../middlewares/app');  //미들웨어 파일명에 맞추기

// 새 메모 작성
router.post('/notelist', auth, async (req, res) => {
    const { userId } = req.body;
    const { note_title } = req.body;

    let newNote = 1;

    let check_title = note_title.split(' ');

    if(check_title[0] === ''){
        res.status(400).send({
            errorMessage: '메모 제목이 공백입니다'
        });
        return;
    }

    try{
        lastIdnum = await Note.find({}).sort({ note_id: -1}).limit(1); 
        newNote = lastIdnum[0].note_id + 1;
    }catch (err){
        newNote = 1;
    }

    const notes = new Note({
        note_id: newNote,
        note_title: note_title,
        userId: userId,
    });
    await notes.save();

    // 메모 30개 생성
    
    for(let i=0; i<30; i++){
        // 아직 미완 메모라우터,스키마보고 참고
        // memos: [{
        //     note_id: 
        //     memo_id : 
        //     memo_title: 
        //     memo_content: 
        //     date: 작성일자
        //     }]

        const memos = new Memo({
            note_id: newNote,
            memo_id: `수정..${userId}_${newNote}_${i}`,
            memo_title: "",     //title, content 어떤 식으로 ? 지금 방식은 공란후 메모에가서 수정
            memo_content: "",
            date: new Date(),
        });
        await memos.save();
    }

    const result = await Memo.find({ userId: userId });

    res.send(result);
})

router.get('/notelist', auth, async (req, res, next) => {
    const { userId } = req.query;
    try{
        const notes = await Note.find({ userId: userId }).sort('note_id');
    }catch (err) {
        console.log(err);

        next(err);
    }
})

router.delete('/notelist/:note_id', auth, async, (req, res, next) => {
    const { note_id } = req.params;
    const { userId } = req.body;

    await Note.deleteOne({ note_id: note_id });
    // await Memo.deleteMany({ note_id: note_id });  // 메모라우터확인후 추가


    const result = await Memo.find({ userId: userId });

    res.send(result);
})

// 라우터 연결 작업후 추가
// router.put('/notelist/:note_id', auth, async, (req, res, next) => {

// })