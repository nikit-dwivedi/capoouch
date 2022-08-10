const mongoose = require('mongoose');
const Schema = mongoose.Schema

const audioSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true,
    },
    audio: {
        type: Object,
        required: true,
    },
    isActive: {
        type: Boolean,
        deafult: true
    }
}, { timestamps: true })

const audioModel = mongoose.model('audio', audioSchema);
module.exports = audioModel;