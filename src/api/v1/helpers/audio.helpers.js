const audioModel = require('../models/audio.model');
const { getIconById } = require('./image.helper');

module.exports = {
    addAudio: async (userId, bodyData) => {
        try {
            const imageData = await getIconById(bodyData.iconId);
            const formattedData = {
                userId: userId,
                title: bodyData.Id,
                icon: imageData,
                audio: bodyData.audio
            }
            const saveData = audioModel(formattedData);
            return saveData.save() ? true : false;
        } catch (error) {
            return false
        }
    },
    getAllAudio: async (userId) => {
        try {
            const audioData = audioModel.find({ userId: userId, isActive: true }).select("-__v");
            return audioData[0] ? audioData : false;
        } catch (error) {
            return false
        }
    },
    removeAudio: async (audioId) => {
        try {
            const changeData = audioModel.findByIdAndUpdate(audioId, { isActive: false });
            return changeData ? true : false;
        } catch (error) {
            return false
        }
    }
}