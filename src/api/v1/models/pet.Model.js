const mongoose = require('mongoose');
const Schema = mongoose.Schema

const petSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "static/avatar/avatar3"
    },
    isAvatar: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const petModel = mongoose.model('pets', petSchema);
module.exports = petModel;