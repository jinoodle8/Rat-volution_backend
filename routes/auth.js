const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

// 회원가입 POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { login_id, nickname, password } = req.body

        // 중복 검사
        const existingId = await User.findOne({ login_id })
        if (existingId) {
            return res.status(409).json({ message: '이미 사용 중인 아이디입니다' })
        }

        const existingNick = await User.findOne({ nickname })
        if (existingNick) {
            return res.status(409).json({ message: '이미 사용 중인 닉네임입니다' })
        }

        // 비밀번호 해시
        const password_hash = await bcrypt.hash(password, 10)

        const user = await User.create({
            login_id,
            nickname,
            password_hash,
            is_guest: false
        })

        res.status(201).json({
            message: '회원가입 성공',
            user_id: user._id
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 로그인 POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { login_id, password } = req.body

        const user = await User.findOne({ login_id })
        if (!user) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다' })
        }

        const valid = await bcrypt.compare(password, user.password_hash)
        if (!valid) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다' })
        }

        // 마지막 로그인 시각 갱신
        user.last_login = new Date()
        await user.save()

        res.status(200).json({
            message: '로그인 성공',
            user_id: user._id,
            nickname: user.nickname,
            is_guest: false
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 게스트 로그인 POST /auth/guest
router.post('/guest', async (req, res) => {
    try {
        const { uuid } = req.body

        // 동일 uuid 게스트 있으면 재사용
        let user = await User.findOne({ login_id: 'guest_' + uuid })

        if (!user) {
            // 게스트 계정 신규 생성
            user = await User.create({
                login_id: 'guest_' + uuid,
                nickname: '게스트' + Math.floor(Math.random() * 10000),
                password_hash: 'guest',
                is_guest: true
            })
        } else {
            user.last_login = new Date()
            await user.save()
        }

        res.status(200).json({
            message: '게스트 로그인 성공',
            user_id: user._id,
            nickname: user.nickname,
            is_guest: true
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

module.exports = router