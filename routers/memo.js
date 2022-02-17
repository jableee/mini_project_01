const express = require("express");
const router = express.Router(); //라우터라고 선언한다.
const url = require("url");
const Memo = require("../schemas/memos");
const authMiddleware = require("../middlewares/auth-middleware");

// router.get("/memo/:note_id/", async (req, res) => {
//   try {
//     const { note_id } = req.params;
//     const memos = await Memo.find({
//       note_id: note_id,
//     }).sort("-date");
//     res.json({ memos: memos });
//   } catch (error) {
    
//     res.status(400).send({ error: error.message });
//   }
// });

router.get("/memo", async (req, res) => {
  try {
    const { memo_id } = req.body;
    console.log(memo_id);
    console.log(typeof(memo_id))
    // const memos = await Memo.find({
    //   note_id: note_id,
    // }).sort("-date");
    const getmemo = await Memo.findOne({  memo_id: memo_id });

    res.json({ getmemo });
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: error.message });
  }
});

router.post("/memo", async (req, res) => {
  const { memo_id, note_id, memo_content, memo_title } = req.body;
  const memos = await Memo.find({ note_id });
  // const date = new Date(+new Date() + 3240 * 10000)
  //   .toISOString()
  //   .replace("T", " ")
  //   .replace(/\..*/, "");
  // if (memos.length) {
  // 	return res
  // 	  .status(400)
  // 	  .json({ success: true, errorMessage: "이미 있는 데이터입니다. " });
  //   }
  const createdMemo = await Memo.create({
    memo_id,
    note_id,
    memo_content,
    memo_title,
    date,
  });

  res.send({ memos: createdMemo });
});

router.put("/memo/:memo_id", async (req, res) => {
  // const { note_id } = req.body;
  const { memo_id } = req.params;
  const { memo_content, memo_title, date } = req.body;
  // const exist_memo = await Memo.find({ note_id: note_id, memo_id: memo_id });
  // console.log(exist_memo)
  // if (!exist_memo.length) {
  //   await Memo.create({
  //     note_id: note_id,
  //     memo_id: memo_id,
  //     memo_content,
  //     memo_title,
  //     date,
  //   });
  // } else {
  //   await Memo.updateOne(
  //     { note_id: note_id, memo_id: memo_id },
  //     { $set: { memo_content, memo_title, date } }
  //   );
  // }
  await Memo.updateOne(
    { memo_id: memo_id},
    { $set: { memo_content, memo_title, date } }
  )
  const test = await Memo.find({ memo_id: memo_id })
  res.send({ success: true, test });
});

router.delete("/memo/:memo_id", async (req, res) => {
  const { memo_id } = req.params;

  const deleteMemo = await Memo.find({ memo_id: memo_id });
  if (deleteMemo.length) {
    await Memo.deleteOne({ memo_id: memo_id });
  }
  res.send({ success: true });
});

module.exports = router;
