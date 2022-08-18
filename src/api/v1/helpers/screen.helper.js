const audioModel = require("../models/audio.model");
const petModel = require("../models/pet.Model");

module.exports = {
    homePage: async (userId) => {
        try {
            const petData = await petModel.findOne({ userId }).select("-_id name image avatar isAvatar")
            const audioList = await audioModel.find({ userId, isActive: true }).select("-__v -_id -userId -isActive")
            return petData ? { petInfo: petData, audioList: audioList } : false;
        } catch (error) {
            return false
        }
    }
}