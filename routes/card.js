const express = require('express')
const router = express.Router()
const CardMaster = require('../models/CardMaster')
const User = require('../models/User')

// 마스터 데이터 전체 조회 GET /card/master
router.get('/master', async (req, res) => {
    try {
        const cards = await CardMaster.find().select('-__v')

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

// 도감 조회 GET /card/dex/:userId
// 유저의 획득 여부와 마스터 카드 데이터를 합쳐서 반환
router.get('/dex/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        const [user, allCards] = await Promise.all([
            User.findById(userId).select('nickname discovered_cards'),
            CardMaster.find().select('-__v').sort({ type: 1, rarity: 1, code: 1 })
        ])

        if (!user) {
            return res.status(404).json({ message: '유저를 찾을 수 없습니다' })
        }

        const discoveredSet = new Set(user.discovered_cards)
        const cards = allCards.map(card => ({
            code: card.code,
            name: card.name,
            type: card.type,
            item_type: card.item_type,
            rarity: card.rarity,
            description: card.description,
            base_value: card.base_value,
            scale_per_stack: card.scale_per_stack,
            max_stack: card.max_stack,
            discovered: discoveredSet.has(card.code)
        }))

        res.status(200).json({
            message: '도감 조회 성공',
            nickname: user.nickname,
            total_cards: allCards.length,
            discovered_count: user.discovered_cards.length,
            cards
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

module.exports = router