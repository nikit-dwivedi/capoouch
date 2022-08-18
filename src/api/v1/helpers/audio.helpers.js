const audioModel = require('../models/audio.model');
const { getIconById } = require('./image.helper');

module.exports = {
    addAudio: async (userId, bodyData, audioUrl) => {
        try {
            const {url} = await getIconById(bodyData.iconId);
            console.log(bodyData);
            const formattedData = {
                userId: userId,
                title: bodyData.title,
                icon: url,
                audio: audioUrl
            }
            const saveData = await audioModel(formattedData);
            return saveData.save() ? true : false;
        } catch (error) {
            return false
        }
    },
    getAllAudio: async (userId) => {
        try {
            const audioData = await audioModel.find({ userId: userId, isActive: true }).select("-isActive -__v");
            console.log(userId);
            return audioData[0] ? audioData : false;
        } catch (error) {
            return false
        }
    },
    removeAudio: async (audioId) => {
        try {
            const changeData = await audioModel.findByIdAndUpdate(audioId, { isActive: false });
            return changeData ? true : false;
        } catch (error) {
            return false
        }
    }
}