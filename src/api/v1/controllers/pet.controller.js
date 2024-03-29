const { validationResult } = require("express-validator");
const { TokenExpiredError } = require("jsonwebtoken");
const { getPetInfo, addPet, editPet, petImageUpload, changeHomeImage } = require("../helpers/pet.helper");
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
            const image = await petImageUpload(req);
            const submitPet = await addPet(tokenData.userId, req.body, image);
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
            const image = await petImageUpload(req);
            const submitPet = await editPet(tokenData.userId, req.body, image);
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
    },
    homeImage: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const token = parseJwt(req.headers.authorization);
            if (req.file) {
                const changeData = await changeHomeImage(token.userId, null, req.file)
                return changeData ? success(res, "success") : badRequest(res, "please provide proper feilds")
            }
            const changeData = await changeHomeImage(token.userId, req.body)
            return changeData ? success(res, "success") : badRequest(res, "please provide proper feilds")
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    }
}