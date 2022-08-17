const { validationResult } = require('express-validator');
const avatarModel = require('../models/avatar.model');
const petModel = require('../models/pet.Model');
const { uploadImage } = require('../services/s3.service');
const { unknownError, badRequest } = require('./response_helper');


module.exports = {
    addPet: async (userId, bodyData, image) => {
        try {
            let isAvatar = false;
            if (image == "") {
                isAvatar = true
            }
            const formattedData = {
                userId: userId,
                name: bodyData.name,
                age: bodyData.age,
                breed: bodyData.breed,
                sex: bodyData.sex,
                weight: bodyData.weight,
                image: image,
                avatar: "static/avatar/avatar3.svg",
                isAvatar: isAvatar
            }
            const saveData = petModel(formattedData);
            return saveData.save() ? true : false;
        } catch (error) {
            return false
        }
    },
    editPet: async (userId, bodyData, image) => {
        try {
            const formattedData = {
                name: bodyData.name,
                age: bodyData.age,
                breed: bodyData.breed,
                sex: bodyData.sex,
                weight: bodyData.weight,
                image: image
            }
            const saveData = petModel.findOneAndUpdate({ userId }, formattedData);
            return saveData ? true : false;
        } catch (error) {
            return false
        }
    },
    getPetInfo: async (userId) => {
        try {
            const petData = petModel.findOne({ userId }).select('-_id -__v')
            return petData ? petData : false
        } catch (error) {
            return false
        }
    },
    petImageUpload: async (reqData) => {
        try {
            if (reqData.file === undefined) {
                const image = ""
                return image
            }
            const { Location } = await uploadImage(reqData.file);
            return Location
        } catch (error) {
            const image = ""
            return image
        }
    },
    changeHomeImage: async (userId, bodyData, file) => {
        try {
            const petData = await petModel.findOne({ userId })
            if (!file) {
                const avatarData = await avatarModel.findById(bodyData.avatarId)
                petData.avatar = avatarData.url
                petData.isAvatar = true
                return await petData.save() ? true : false
            }
            const { Location } = await uploadImage(file);
            petData.image = Location
            petData.isAvatar = false;
            return await petData.save() ? true : false
        } catch (error) {
            return false
        }
    }
}

