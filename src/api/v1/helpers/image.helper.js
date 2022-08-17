const avatarModel = require('../models/avatar.model');
const iconModel = require('../models/icon.model');

module.exports = {
    addIcon: async (image) => {
        try {
            const formattedData = {
                url: `static/icon/${image}.png`,
            }
            const saveData = await iconModel(formattedData);
            return await saveData.save() ? true : false
        } catch (error) {
            return false
        }
    },
    addAvatar: async (image) => {
        try {
            const formattedData = {
                url: `static/avatar/${image}.svg`,
            }
            const saveData = await avatarModel(formattedData);
            return await saveData.save() ? true : false
        } catch (error) {
            return false
        }
    },
    getAllIcon: async () => {
        try {
            const iconlist = await iconModel.find().select('-__v');
            return iconlist[0] ? iconlist : false
        } catch (error) {
            return false
        }
    },
    getAllAvatar: async () => {
        try {
            const avatarlist = await avatarModel.find().select('-__v');
            return avatarlist[0] ? avatarlist : false
        } catch (error) {
            return false
        }
    },
    getIconById: async (iconId) => {
        try {
            const imageData = await iconModel.findById(iconId).select('-_id name path')
            return imageData ? imageData : false
        } catch (error) {
            return false
        }
    },
    getAvatarById: async (avatarId) => {
        try {
            const imageData = await iconModel.findById(avatarId).select('-_id name path')
            return imageData ? imageData : false
        } catch (error) {
            return false
        }
    }
}