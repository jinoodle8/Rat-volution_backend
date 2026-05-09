const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    nickname: {
        type: String,
        required: true,
        index: true
    },
    password_hash: {
        type: String,
        required: true
    },
    max_wave_reached: {
        type: Number,
        default: 0,
        index: true
    },
    total_cheese: {
        type: Number,
        default: 0
    },
    max_record_date: {
        type: Date,
        default: null
    },
    discovered_cards: {
        type: [String],
        default: []
    },
    is_guest: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('User', userSchema)