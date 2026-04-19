//models/CardMaster.js

const mongoose = require('mongoose')

const cardMasterSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['statup', 'item', 'debuff'], required: true },
    item_type: { type: String, enum: ['active', 'oneTime'], default: null },  // type이 item일 때만 존재
    rarity: { type: String, enum: ['debuff', 'normal', 'rare', 'legendary'], required: true },
    description: { type: String },
    base_value: { type: Number, default: 0.0 },                        // Float
    scale_per_stack: { type: Number, default: 0.0 },                   // Float
    max_stack: { type: Number, default: 1, min: 1 }                    // Int32
})

module.exports = mongoose.model('CardMaster', cardMasterSchema)