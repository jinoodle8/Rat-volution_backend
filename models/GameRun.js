//models/GameRun.js

const mongoose = require('mongoose')

const gameRunSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['dead', 'cleared'], required: true },
    final_wave: { type: Number, default: 1, min: 1 },                  // Int32
    total_cheese_earned: { type: Number, default: 0, min: 0 },         // Int32
    final_hp: { type: Number, default: 0, min: 0 },                    // Int32

    stats: {
        move_speed: { type: Number, default: 0.0 },                    // Float
        luck: { type: Number, default: 0.0 },                          // Float
        insight: { type: Number, default: 0.0 },                       // Float
        attack_speed: { type: Number, default: 0.0 },                  // Float
        power: { type: Number, default: 0.0 },                         // Float
        attack_power: { type: Number, default: 0.0 }                   // Float
    },

    started_at: { type: Date, required: true },
    ended_at: { type: Date, default: null }
})

module.exports = mongoose.model('GameRun', gameRunSchema)