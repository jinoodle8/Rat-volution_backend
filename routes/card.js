const express = require('express')
const router = express.Router()
const CardMaster = require('../models/CardMaster')

// 마스터 데이터 전체 조회 GET /card/master
// 게임 초기 접속 시 1회 전송 (REQ-046)
router.get('/master', async (req, res) => {
    try {
        const cards = await CardMaster.find()
            .select('-__v')     // mongoose 내부 필드 제외

        res.status(200).json({
            message: '마스터 데이터 조회 성공',
            cards
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 카드 단건 조회 GET /card/master/:code
router.get('/master/:code', async (req, res) => {
    try {
        const { code } = req.params

        const card = await CardMaster.findOne({ code })
        if (!card) {
            return res.status(404).json({ message: '카드를 찾을 수 없습니다' })
        }

        res.status(200).json({
            message: '카드 조회 성공',
            card
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

module.exports = router