//models/memberModel.js

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        default: '',
        trim: true
    },
    outstandingDebt: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 500 // Max debt limit ₹500
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);