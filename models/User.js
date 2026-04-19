// models/User.js

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login_id: { type: String, required: true, unique: true },
    nickname: { type: String },
    password_hash: { type: String },
    max_wave_reached: { type: Number, default: 0, min: 0 },            // Int32
    total_cheese: { type: Number, default: 0, min: 0 },                //Int32
    max_record_date: { type: Date, default: null },
    discovered_cards: { type: [String], default: [] },
    last_login: { type: Date, default: Date.now },
    is_guest: { type: Boolean, required: true, default: false }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
})

module.exports = mongoose.model('User', userSchema)