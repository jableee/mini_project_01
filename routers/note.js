const express = require("express");
const router = express.Router();
const Note = require("../schemas/notes");
const Memo = require("../schemas/memos"); //메모스키마 확인후 맞추기
const auth = require("../middlewares/auth-middleware"); //미들웨어 파일명에 맞추기

// 새 note 작성
router.post("/notelist", auth, async (req, res) => {
  console.log("post new note");
  const { user_id } = req.body;
  const { note_title } = req.body; // note_title = req.body.note_title

  console.log(note_title);
  let newNote = 1;

  let check_title = note_title.split(" ");

  if (check_title[0] === "") {
    res.status(400).send({
      errorMessage: "메모 제목이 공백입니다",
    });
    return;
  }

  try {
    lastIdnum = await Note.find({}).sort({ note_id: -1 }).limit(1);
    newNote = lastIdnum[0].note_id + 1;
  } catch (err) {
    newNote = 1;
  }

  const notes = new Note({
    note_id: newNote,
    note_title: note_title,
    user_id: user_id,
  });
  await notes.save();

  // 메모 30개 생성

  for (let i = 0; i < 30; i++) {
    const memos = new Memo({
      note_id: newNote,
      memo_id: `${user_id}_${newNote}_${i}`,
      memo_title: "test", //title, content 어떤 식으로 ? 지금 방식은 공란후 메모에가서 수정
      memo_content: "test",
      date: new Date(),
    });
    await memos.save();
  }

  const result = await Note.find({ user_id: user_id });

  res.send(result);
});

router.get("/notelist", auth, async (req, res, next) => {
  const { user_id } = req.query;
  try {
    const notes = await Note.find({ user_id: user_id }).sort("note_id");
    console.log(notes);
    res.json({ notes: notes });
  } catch (err) {
    console.log(err);

    next(err);
  }
});

router.delete("/notelist/:note_id", auth, async (req, res, next) => {
  const { note_id } = req.params;
  const { user_id } = req.body;

  // const isNote = await Note.deleteOne({ note_id: note_id });
  // if(isNote)

  await Note.deleteOne({ note_id: note_id });
  await Memo.deleteMany({ note_id: note_id }); // 메모라우터확인후 추가

  const result = await Memo.find({ user_id: user_id });

  res.send(result);
});

// 라우터 연결 작업후 추가
router.put("/notelist/:note_id", auth, async (req, res, next) => {
  const { note_id } = req.params;
  const { user_id, note_title } = req.body;

  let check_title = note_title.split(" ");

  if (check_title[0] === "") {
    res.status(400).send({
      errorMessage: "메모 제목이 공백입니다",
    });
    return;
  }

  await Note.updateOne({
    note_id: note_id,
  },{
    $set:{ note_title: note_title }
  })

  const result = await Note.findOne({ user_id: user_id });

  res.send(result);

});

// 수정 버튼 들어갈때
router.get('/notelist/:note_id', auth, async (req, res, next) => {
  const { note_id } = req.params;

  const result = await Note.findOne({ note_id: note_id });

  res.send(result);
})

module.exports = router;
