const mongoose = require('mongoose');
const Schema = mongoose.Schema

const audioSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    icon: {
        type: Object,
        required: true,
    },
    audio: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const audioModel = mongoose.model('audio', audioSchema);
module.exports = audioModel;