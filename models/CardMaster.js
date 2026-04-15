const mongoose = require('mongoose')

const cardMasterSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['passive', 'active', 'one_time'], required: true },
  rarity: { type: String, enum: ['normal', 'rare', 'legendary'], required: true },
  description: { type: String },
  base_value: { type: Number, required: true },
  scale_per_stack: { type: Number, default: 0 },
  max_stack: { type: Number, default: 999 },
  icon_path: { type: String }
})

module.exports = mongoose.model('CardMaster', cardMasterSchema)