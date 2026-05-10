const jwt = require('jsonwebtoken')

// JWT 인증 미들웨어
// 보호된 라우트 진입 전 토큰 검증, req.user에 페이로드 주입
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '인증 토큰이 없습니다' })
    }

    const token = authHeader.substring(7)   // "Bearer " 7자 제거

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload   // { user_id, nickname, is_guest }
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '토큰이 만료되었습니다' })
        }
        return res.status(401).json({ message: '유효하지 않은 토큰입니다' })
    }
}

module.exports = authenticate