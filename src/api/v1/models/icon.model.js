const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    id: { type: Number },
    url: { type: String }
})

const iconModel = mongoose.model('icon', iconSchema);
module.exports = iconModel;