const express = require('express')
const router = express.Router()
const Leaderboard = require('../models/Leaderboard')

// 랭킹 TOP 100 조회 GET /leaderboard
router.get('/', async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find()
            .sort({
                max_wave_reached: -1,   // 1순위: 최고 웨이브 내림차순
                total_cheese: -1,       // 2순위: 누적 치즈 내림차순
                achieved_at: 1          // 3순위: 달성 시점 오름차순 (나중이 우선)
            })
            .limit(100)
            .select('nickname max_wave_reached total_cheese achieved_at')  // 필요한 필드만 반환

        res.status(200).json({
            message: '랭킹 조회 성공',
            leaderboard
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 내 랭킹 조회 GET /leaderboard/:user_id
router.get('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params

        const record = await Leaderboard.findOne({ user_id })
        if (!record) {
            return res.status(404).json({ message: '랭킹 기록이 없습니다' })
        }

        res.status(200).json({
            message: '내 랭킹 조회 성공',
            record
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

module.exports = router