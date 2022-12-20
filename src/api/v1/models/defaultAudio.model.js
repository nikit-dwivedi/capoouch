const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultAudioSchema = new Schema({
    audioId: {
        type: String,
        unique: true,
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
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

exports.defaultAudioModel = mongoose.model("defaultAudio", defaultAudioSchema)