const mongoose = require('mongoose')

const cardMasterSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['statup', 'item', 'debuff'],
        required: true
    },
    item_type: {
        type: String,
        enum: ['active', 'oneTime', null],
        default: null
    },
    rarity: {
        type: String,
        enum: ['debuff', 'normal', 'rare', 'legendary'],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    base_value: {
        type: Number,
        default: 0.0
    },
    scale_per_stack: {
        type: Number,
        default: 0.0
    },
    max_stack: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('CardMaster', cardMasterSchema)