const mongoose = require('mongoose')

const gameRunSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['dead', 'cleared'],
        default: 'dead'
    },
    final_wave: {
        type: Number,
        default: 1,
        min: 1
    },
    total_cheese_earned: {
        type: Number,
        default: 0,
        min: 0
    },
    final_hp: {
        type: Number,
        default: 0,
        min: 0
    },
    stats: {
        move_speed: { type: Number, default: 0.0 },
        luck: { type: Number, default: 0.0 },
        insight: { type: Number, default: 0.0 },
        attack_speed: { type: Number, default: 0.0 },
        power: { type: Number, default: 0.0 },
        attack_power: { type: Number, default: 0.0 }
    },
    started_at: {
        type: Date,
        default: Date.now
    },
    ended_at: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('GameRun', gameRunSchema)