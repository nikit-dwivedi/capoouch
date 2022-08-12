const { validationResult } = require("express-validator");
const { addAudio, getAllAudio, removeAudio } = require("../helpers/audio.helpers");
const { badRequest, unknownError, created } = require('../helpers/response_helper');
const { parseJwt } = require("../middlewares/authToken");
const uploadAudio = require("../services/s3.service");

module.exports = {
    addNewAudio: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const { userId } = parseJwt(req.headers.authorization);
            const { Location } = await uploadAudio(req.file);
            const saveData = await addAudio(userId, req.body, Location);
            return saveData ? created(res, "audio added") : badRequest(res, "please provide proper feilds");
        } catch (error) {
            return unknownError(res, "unknown error");
        }
    },
    getAudioList: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const { userId } = parseJwt(req.headers.authorization);
            const audioList = await getAllAudio(userId);
            return audioList ? created(res, "audio list", audioList) : badRequest(res, "please add audio first");
        } catch (error) {
            console.log(error);
            return unknownError(res, "unknown error");
        }
    },
    removeAudio: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const audioList = await removeAudio(req.body.audioId);
            return audioList ? created(res, "audio removed") : badRequest(res, "bad request");
        } catch (error) {
            return unknownError(res, "unknown error");
        }
    }
}