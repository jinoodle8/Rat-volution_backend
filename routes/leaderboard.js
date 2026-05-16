const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')   // ← 추가
const Leaderboard = require('../models/Leaderboard')
const authenticate = require('../middleware/auth')

// TOP 100 랭킹 GET /leaderboard (인증 불필요)
router.get('/', async (req, res) => {
    try {
        const top100 = await Leaderboard.find()
            .sort({
                max_wave_reached: -1,
                total_cheese: -1,
                achieved_at: 1
            })
            .limit(100)
            .select('-__v')

        const ranked = top100.map((entry, idx) => ({
            rank: idx + 1,
            user_id: entry.user_id,
            nickname: entry.nickname,
            max_wave_reached: entry.max_wave_reached,
            total_cheese: entry.total_cheese,
            achieved_at: entry.achieved_at
        }))

        res.status(200).json({
            message: '랭킹 조회 성공',
            leaderboard: ranked
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 내 랭킹 GET /leaderboard/me (인증 필요)
router.get('/me', authenticate, async (req, res) => {
    try {
        // 토큰의 user_id를 ObjectId로 변환
        const user_id = new mongoose.Types.ObjectId(req.user.user_id)

        const myEntry = await Leaderboard.findOne({ user_id })
        if (!myEntry) {
            return res.status(404).json({ message: '랭킹 기록이 없습니다' })
        }

        const higherCount = await Leaderboard.countDocuments({
            $or: [
                { max_wave_reached: { $gt: myEntry.max_wave_reached } },
                {
                    max_wave_reached: myEntry.max_wave_reached,
                    total_cheese: { $gt: myEntry.total_cheese }
                },
                {
                    max_wave_reached: myEntry.max_wave_reached,
                    total_cheese: myEntry.total_cheese,
                    achieved_at: { $lt: myEntry.achieved_at }
                }
            ]
        })

        res.status(200).json({
            message: '내 랭킹 조회 성공',
            rank: higherCount + 1,
            nickname: myEntry.nickname,
            max_wave_reached: myEntry.max_wave_reached,
            total_cheese: myEntry.total_cheese,
            achieved_at: myEntry.achieved_at
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

module.exports = router