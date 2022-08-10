const { validationResult } = require("express-validator");
const { getPetInfo, addPet, editPet } = require("../helpers/pet.helper");
const { badRequest, success, created, unknownError } = require("../helpers/response_helper");
const { parseJwt } = require("../middlewares/authToken");

module.exports = {
    addPet: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds")
            }
            const tokenData = parseJwt(req.headers.authorization);
            const petCheck = await getPetInfo(tokenData.userId);
            if (petCheck) {
                return badRequest(res, "cant add multiple pet")
            }
            const submitPet = await addPet(tokenData.userId, req.body);
            return submitPet ? created(res, "pet added successfully") : badRequest(res, "please provide proper feilds")
        } catch (error) {
            console.log(error);
            return unknownError(res, "unknown error");
        }
    },
    editPet: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds")
            }
            const tokenData = parseJwt(req.headers.authorization);
            const submitPet = await editPet(tokenData.userId, req.body);
            return submitPet ? success(res, "pet updated successfully") : badRequest(res, "please provide proper feilds")
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    },
    petInfo: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds")
            }
            const tokenData = parseJwt(req.headers.authorization);
            const submitPet = await getPetInfo(tokenData.userId);
            return submitPet ? success(res, "pet info", submitPet) : badRequest(res, "pet not added")
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    }
}