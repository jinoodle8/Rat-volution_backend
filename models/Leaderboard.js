//models/Leaderboard.js

const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    nickname: { type: String, required: true },
    max_wave_reached: { type: Number, default: 0, min: 0 },            // Int32
    total_cheese: { type: Number, default: 0, min: 0 },                // Int32
    achieved_at: { type: Date, default: Date.now }
})

// 1순위 내림차순, 2순위 내림차순, 3순위 오름차순
leaderboardSchema.index(
    { max_wave_reached: -1, total_cheese: -1, achieved_at: 1 }
)

module.exports = mongoose.model('Leaderboard', leaderboardSchema)