const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatarSchema = new Schema({
    id: {
        type: Number
    },
    url: {
        type: String
    },
});

const avatarModel = mongoose.model('avatar', avatarSchema);
module.exports = avatarModel;