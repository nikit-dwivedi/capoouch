const audioModel = require('../models/audio.model');
const { defaultAudioModel } = require('../models/defaultAudio.model');
const { getIconById } = require('./image.helper');
const { randomBytes } = require('node:crypto');

module.exports = {
    addAudio: async (userId, bodyData, audioUrl) => {
        try {
            const { url } = await getIconById(bodyData.iconId);
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
    },
    addDefaultAudio: async (title,) => {
        try {
            const audioId = randomBytes(4).toString('hex')
            const icon = "static/icon/icon10.png"
            const audio = `static/audio/${title}.wav`
            const data = { audioId, icon, title, audio }
            const saveData = new defaultAudioModel(data);
            await saveData.save()
            return saveData ? { status: true, message: "audio added", data: {} } : { status: false, message: "audio not added", data: {} };
        } catch (error) {
            return { status: false, message: error.message, data: {} }
        }
    },
    getDefaultAudioList: async () => {
        try {
            const audioList = await defaultAudioModel.find().select("-_id -createdAt -updatedAt -isActive -__v");
            return audioList[0] ? { status: true, message: "default audio list", data: audioList } : { status: false, message: "no default audio", data: {} };
        } catch (error) {
            return { status: false, message: error.message, data: {} }
        }
    }
}