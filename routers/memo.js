const express = require('express')
const router = express.Router() //라우터라고 선언한다.
const url = require('url')
const Memo = require('../schemas/memo')
const authMiddleware = require('../middlewares/auth-middleware.js')

router.get("/memo", async (req, res, next) => {
    const { note_id } = req.body;
    try {
        const memos = await Memo.find({}).sort("memo_id");
        res.json({ memos: memos });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

// router.get('/memo/:note_id', async (req, res) => {
//     const { note_id } = req.params
//     const memos = await Memo.findOne({ note_id: note_id })
//     res.json({ memos: memos })
// })

router.post('/memo', async (req, res) => {
    const { memo_id, note_id, memo_content, memo_title, date } = req.body;
    const memos = await Memo.find({ note_id });
	if (memos.length) {
		return res
		  .status(400)
		  .json({ success: false, errorMessage: "이미 있는 데이터입니다. " });
	  }
	  const createdMemo = await Memo.create({ 
        memo_id, 
        note_id, 
        memo_content, 
        memo_title, 
        date 
		})

    res.send({ memos: createdMemo });
});

router.put("/memo/:memo_id", async (req, res) => {
    const { memo_id } = req.params;
    const { memo_content,memo_title,date } = req.body;
   
	const exist_memo = await Memo.find({ memo_id: memo_id });
    // console.log(exist_memo)
    if (!exist_memo.length) {
        await Memo.create({ memo_id: memo_id, memo_content, memo_title, date });
	}else {	
		await Memo.updateOne({ memo_id: memo_id }, { $set: { memo_content, memo_title, date } });
    }
    res.send({ success: true });
});


router.delete("/memo/:memo_id", async (req, res) => {
    const { memo_id } = req.params

    const deleteMemo = await Memo.find({ memo_id: memo_id });
    if (deleteMemo.length) {
        await Memo.deleteOne({ memo_id: memo_id });
    }
    res.send({ success: true });
});

module.exports = router;



