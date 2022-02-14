const express = require('express');
const jwt = require('jsonwebtoken');
const User = ('../schemas/user');
const router = express.Router();
const Joi = require('joi');
const authMiddleware = require('../middlewares/auth-middleware');


const UsersSchema = Joi.object({
    nickname: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,}$')),
    pw: Joi.string().required(),
});

// 회원가입

router.post('/signup', async (req, res) => {
    try {
        const { nickname, pw } = await UsersSchema.validateAsync(
            req.body
        );

        const existUsers = await User.find({
            nickname,
        });
        if (existUsers.length) {
            res.status(400).send({
                errorMessage: '이미 존재하는 닉네임입니다!',
            });
            return;
        }

        if (pw.search(nickname) > -1) {
            res.status(400).send({
                errorMessage: '비밀번호에 닉네임이 포함되어있습니다!',
            });
            return;
        }

        if (pw.length < 4) {
            res.status(400).send({
                errorMessage: '비밀번호는 4자이상 입력해주세요!',
            });
            return;
        }

        const recentUserId = await User.find().sort('-userId').limit(1);
        let userId = 1;
        if (recentUserId.length !== 0) {
            userId = recentUserId[0]['userId'] + 1;
        }

        const user = new User({ nickname, pw, userId });
        await user.save();

        res.status(201).send({});
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    }
});

const LoginAuthSchema = Joi.object({
    nickname: Joi.string().required(),
    pw: Joi.string().required(),
});

//로그인 (토큰발급)
router.post('/auth', async (req, res) => {
    try {
        const { nickname, pw } = await LoginAuthSchema.validateAsync(req.body);

        const user = await User.findOne({ nickname, pw }).exec();

        if (!user) {
            res.status(400).send({
                errorMessage: '닉네임 또는 패스워드를 확인해주세요!',
            });
            return;
        }

        const token = jwt.sign({ userId: user.userId }, 'my-secret-key');
        res.send({
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    }
});

router.get('/users/me', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
        user,
    });
});


module.exports = router;