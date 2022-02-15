const express = require('express');
const User = require('../schemas/user');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');
const crypto = require('crypto');
require('dotenv').config()

const router = express.Router();

const UsersSchema = Joi.object({
    user_id: Joi.string().alphanum().min(3).max(30).required(),
    nickname: Joi.string().required(),
    pw: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
    pw2: Joi.string().required(),
});

//회원가입

router.post('/signup', async (req, res) => {
    try {
        const { user_id, nickname, pw, pw2 } = await UsersSchema.validateAsync(req.body);

        if (pw !== pw2) {
            res.status(400).send({
                errorMessage: '비밀번호가 일치하지 않습니다!',
            })
            return;
        } else if (user_id === pw) {
            res.status(400).send({
                errorMessage: '아이디와 비밀번호가 일치합니다!',
            });
            return;
        }

        const existUsers = await User.find ({ user_id });
        if (existUsers.length) {
            res.status(400).send({
                errorMessage: '이미 사용중인 아이디입니다.',
            });
            return;
        }

        const existNicknames = await User.find ({ nickname });
        if (existNicknames.length) {
            res.status(400).send({
                errorMessage: '이미 사용중인 닉네임입니다.',
            });
            return;
        }
        
        const encodedPW = crypto.createHash(process.env.Algorithm).update(pw + process.env.salt).digest('base64');

        const user = new User({ 
            user_id: user_id,
            pw: encodedPW,
            nickname: nickname,
         });
        await user.save();

        res.status(201).send({
            ok:true,
            message: "회원가입을 축하드립니다",
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    }
});

const LoginSchema = Joi.object({
    user_id: Joi.string().alphanum().min(3).max(30).required(),
    pw: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
});

router.post('/login', async (req, res) => {
    try {
        const { user_id, pw } = await LoginSchema.validateAsync(req.body);

        const encodedPW = crypto.createHash(process.env.Algorithm).update(pw + process.env.salt).digest('base64');

//        const user = await User.findOne({ user_id, pw }).exec();
        const user = await User.findOne({ user_id });

        if(!user || encodedPW !== user.pw) {
            res.status(400).send({
                errorMessage: '아이디 또는 패스워드를 다시 확인해주세요',
            });
            return;
        }

        // if (!user) {
        //     res.status(400).send({
        //         errorMessage: '아이디 또는 패스워드를 다시 확인해주세요',
        //     });
        //     return;
        // }

//        console.log(process.env.TOKENKEY);

        const token = jwt.sign({ user_id: user.userId }, process.env.TOKENKEY);
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