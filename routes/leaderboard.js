const express = require('express')
const router = express.Router()
const Leaderboard = require('../models/Leaderboard')

// TOP 100 랭킹 GET /leaderboard
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

        // 랭크 번호 추가
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

// 내 랭킹 GET /leaderboard/me?user_id=xxx
router.get('/me', async (req, res) => {
    try {
        const { user_id } = req.query

        const myEntry = await Leaderboard.findOne({ user_id })
        if (!myEntry) {
            return res.status(404).json({ message: '랭킹 기록이 없습니다' })
        }

        // 내 위에 있는 사람 수 + 1 = 내 순위
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