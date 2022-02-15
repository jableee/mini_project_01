const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

module.exports = (req, res, next) => {
    console.log('auth 미들웨어 in')
    const { authorization } = req.headers;
    console.log(authorization)
    const [tokenType, tokenValue] = authorization.split(' ');
    console.log('토큰타입',tokenType,)
    
    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용해주세요.',
        });
        return;
    }

    try {
        const { user_id } = jwt.verify(tokenValue, 'my-secret-key');
        console.log('',user_id)
        User.findById(user_id).exec().then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '2차 에러 로그인 후 사용해주세요!',
        });
        return;
    };
};