// routes/auth.js

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

// 회원가입 POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { login_id, nickname, password } = req.body

        // 필수 입력값 확인
        if (!login_id || !password) {
            return res.status(400).json({ message: 'ID와 PASSWORD는 필수입니다.' })
        }
        // 닉네임 미입력 시 안내 메시지
        if (!nickname) {
            return res.status(400).json({ message: '닉네임은 필수입니다' })
        }

        // 중복 ID 확인
        const existing = await User.findOne({ login_id })
        if (existing) {
            return res.status(409).json({ message: '이미 사용 중인 ID입니다.' })
        }

        // 비밀번호 암호화
        const password_hash = await bcrypt.hash(password, 10)

        // 유저 생성
        const user = await User.create({
            login_id,
            nickname,
            password_hash,
            is_guest: false
        })

        res.status(201).json({ message: '회원가입 성공', user_id: user._id })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 로그인 POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { login_id, password } = req.body

        // 필수 입력값 확인
        if (!login_id || !password) {
            return res.status(400).json({ message: 'login_id와 password는 필수입니다' })
        }

        // 유저 조회
        const user = await User.findOne({ login_id })
        if (!user) {
            return res.status(401).json({ message: 'ID 또는 비밀번호가 올바르지 않습니다' })
        }

        // 게스트 계정으로 로그인 시도 방지
        if (user.is_guest) {
            return res.status(401).json({ message: '게스트 계정은 일반 로그인이 불가합니다' })
        }

        // 비밀번호 검증
        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return res.status(401).json({ message: 'ID 또는 비밀번호가 올바르지 않습니다' })
        }

        // 최근 접속일 갱신
        user.last_login = new Date()
        await user.save()

        res.status(200).json({
            message: '로그인 성공',
            user_id: user._id,
            nickname: user.nickname,
            is_guest: user.is_guest
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 게스트 로그인 POST /auth/guest
router.post('/guest', async (req, res) => {
    try {
        const { uuid } = req.body  // Unity에서 로컬 저장한 UUID 전송

        // 기존 게스트 계정 확인
        let user = await User.findOne({ login_id: uuid })

        if (!user) {
            // 없으면 새 게스트 계정 생성
            user = await User.create({
                login_id: uuid,
                nickname: `게스트_${uuid.slice(0, 6)}`,  // 앞 6자리로 닉네임 생성
                is_guest: true
            })
        } else {
            // 있으면 최근 접속일만 갱신
            user.last_login = new Date()
            await user.save()
        }

        res.status(200).json({
            message: '게스트 로그인 성공',
            user_id: user._id,
            nickname: user.nickname,
            is_guest: user.is_guest
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

module.exports = router