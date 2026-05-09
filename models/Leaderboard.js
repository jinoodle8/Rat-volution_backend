const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true
    },
    max_wave_reached: {
        type: Number,
        default: 0
    },
    total_cheese: {
        type: Number,
        default: 0
    },
    achieved_at: {
        type: Date,
        default: Date.now
    }
})

// 복합 인덱스 (랭킹 정렬용)
leaderboardSchema.index({
    max_wave_reached: -1,  //내림차순
    total_cheese: -1,  //내림차순
    achieved_at: 1  //오름차순
})

module.exports = mongoose.model('Leaderboard', leaderboardSchema)