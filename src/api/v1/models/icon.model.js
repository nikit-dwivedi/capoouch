const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    id: {
        type: Number
    },
    path: {
        type: String,
    },
    name: {
        type: String
    },
})

const iconModel = mongoose.model('icon', iconSchema);
module.exports = iconModel;