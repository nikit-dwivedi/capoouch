const petModel = require('../models/pet.Model');


module.exports = {
    addPet: async (userId, bodyData) => {
        try {
            const formattedData = {
                userId: userId,
                name: bodyData.name,
                age: bodyData.age,
                breed: bodyData.breed,
                sex: bodyData.sex,
                weight: bodyData.weight,
                image: bodyData.image
            }
            const saveData = petModel(formattedData);
            return saveData.save() ? true : false;
        } catch (error) {
            return false
        }
    },
    editPet: async (userId, bodyData) => {
        try {
            const formattedData = {
                name: bodyData.name,
                age: bodyData.age,
                breed: bodyData.breed,
                sex: bodyData.sex,
                weight: bodyData.weight,
                image: bodyData.image
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
    }
}