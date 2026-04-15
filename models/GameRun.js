const mongoose = require('mongoose')

const gameRunSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // users 컬렉션과 연결
  status: { type: String, enum: ['dead', 'cleared'], required: true }, // 둘중 하나만 입력 가능
  final_wave: { type: Number, required: true },
  total_cheese_earned: { type: Number, required: true },
  final_hp: { type: Number, required: true },
  play_time_seconds: { type: Number, required: true },
  
  stats: {
    move_speed: Number,
    luck: Number,
    insight: Number,
    attack_speed: Number,
    power: Number,
    attack_power: Number
  },
  
  inventory: {
    cards: [{
      card_code: String,
      stack_count: Number
    }],
    items: [{
      item_code: String,
      is_used: Boolean
    }]
  },
  
  started_at: { type: Date, required: true },
  ended_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('GameRun', gameRunSchema)