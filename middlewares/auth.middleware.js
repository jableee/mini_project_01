const jwt = require('jwonwebtoken');
const user = require('../schemas/user');
const User = require('../schemas/user');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [ tokenType, tokenValue ] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요!',
        });
        return;
    }

    try {
        const { userId } = jwt.verify(tokenValue, 'my-secret-key');
        User.findOne({ userId }).exec().then((uer) => {
            res.locals.user = {
                userId: user.userId,
                pw: user.pw,
                nickname: user.nickname,
            };
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요!',
        });
        return;
    }
};