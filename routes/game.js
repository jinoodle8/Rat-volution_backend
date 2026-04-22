const express = require('express')
const router = express.Router()
const GameRun = require('../models/GameRun')
const User = require('../models/User')
const Leaderboard = require('../models/Leaderboard')

// 게임 시작 POST /game/start
router.post('/start', async (req, res) => {
    try {
        const { user_id } = req.body

        // 유저 존재 확인
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(404).json({ message: '유저를 찾을 수 없습니다' })
        }

        // 게임 로그 도큐먼트 생성
        const gameRun = await GameRun.create({
            user_id,
            status: 'dead',             // 기본값 dead, 정상 클리어 시 cleared로 변경
            final_wave: 1,
            total_cheese_earned: 0,
            final_hp: 0,
            stats: {
                move_speed: 0.0,
                luck: 0.0,
                insight: 0.0,
                attack_speed: 0.0,
                power: 0.0,
                attack_power: 0.0
            },
            started_at: new Date(),
            ended_at: null
        })

        res.status(201).json({
            message: '게임 시작',
            game_run_id: gameRun._id
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 게임 종료 POST /game/end
router.post('/end', async (req, res) => {
    try {
        const {
            game_run_id,
            status,
            final_wave,
            total_cheese_earned,
            final_hp,
            stats,
            discovered_cards
        } = req.body

        // 게임 로그 조회
        const gameRun = await GameRun.findById(game_run_id)
        if (!gameRun) {
            return res.status(404).json({ message: '게임 로그를 찾을 수 없습니다' })
        }

        // ---- 서버 측 데이터 검증 (NF-004) ----
        if (final_wave < 1) {
            return res.status(400).json({ message: '비정상적인 웨이브 값입니다' })
        }
        if (total_cheese_earned < 0) {
            return res.status(400).json({ message: '비정상적인 치즈 값입니다' })
        }
        if (final_hp < 0) {
            return res.status(400).json({ message: '비정상적인 체력 값입니다' })
        }

        // 게임 로그 최종 저장
        gameRun.status = status
        gameRun.final_wave = final_wave
        gameRun.total_cheese_earned = total_cheese_earned
        gameRun.final_hp = final_hp
        gameRun.stats = stats
        gameRun.ended_at = new Date()
        await gameRun.save()

        // 유저 누적 치즈 갱신
        const user = await User.findById(gameRun.user_id)
        user.total_cheese += total_cheese_earned

        // 도감 업데이트 - 신규 카드만 추가 (REQ-047, API-GAM-004)
        if (Array.isArray(discovered_cards) && discovered_cards.length > 0) {
            const newCards = discovered_cards.filter(
                code => !user.discovered_cards.includes(code)
            )
            if (newCards.length > 0) {
                user.discovered_cards.push(...newCards)
            }
        }

        await user.save()

        // 랭킹 갱신 - 기존 최고 기록보다 높을 때만 업데이트 (REQ-044)
        await updateLeaderboard(user, final_wave, user.total_cheese)

        res.status(200).json({ message: '게임 종료 저장 완료' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '서버 오류' })
    }
})

// 랭킹 갱신 함수
async function updateLeaderboard(user, final_wave, total_cheese) {
    const existing = await Leaderboard.findOne({ user_id: user._id })

    if (!existing) {
        // 랭킹 기록 없으면 신규 생성
        await Leaderboard.create({
            user_id: user._id,
            nickname: user.nickname,
            max_wave_reached: final_wave,
            total_cheese,
            achieved_at: new Date()
        })
        // 유저 최고 기록 갱신
        user.max_wave_reached = final_wave
        user.max_record_date = new Date()
        await user.save()
        return
    }

    // 1순위: 웨이브 비교
    const isBetterWave = final_wave > existing.max_wave_reached

    // 2순위: 웨이브 같으면 치즈 비교
    const isSameWaveBetterCheese =
        final_wave === existing.max_wave_reached &&
        total_cheese > existing.total_cheese

    if (isBetterWave || isSameWaveBetterCheese) {
        existing.max_wave_reached = final_wave
        existing.total_cheese = total_cheese
        existing.nickname = user.nickname      // 닉네임 변경 반영
        existing.achieved_at = new Date()
        await existing.save()

        // 유저 최고 기록도 갱신
        user.max_wave_reached = final_wave
        user.max_record_date = new Date()
        await user.save()
    }
}

module.exports = router