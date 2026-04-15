const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login_id: { type: String, required: true, unique: true }, // 중복 가입 방지 (unique)
    nickname: { type: String },
    password_hash: { type: String },
    max_wave_reached: { type: Number, default: 0 },           // 기본값 0
    total_cheese: { type: Number, default: 0 },
    max_record_date: { type: Date },
    discovered_cards: { type: [String], default: [] },        // 빈 도감으로 시작
    last_login: { type: Date, default: Date.now },            // 로그인 시 현재 시간 자동 기록
    is_guest: { type: Boolean, required: true, default: false }
    }, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
})

module.exports = mongoose.model('User, userSchema')