const { validationResult } = require("express-validator");
const { addAudio, getAllAudio, removeAudio, getDefaultAudioList, addDefaultAudio, getDefaultAudioByAudioId } = require("../helpers/audio.helpers");
const { badRequest, unknownError, created } = require('../helpers/response_helper');
const { parseJwt } = require("../middlewares/authToken");
const { uploadAudio, mergeAudio } = require("../services/s3.service");

module.exports = {
    addNewAudio: async (req, res) => {
        try {
            let location = ""
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const { userId } = parseJwt(req.headers.authorization);
            // if (req.body.defaultAudioId) {
            const defaultAudioData = await getDefaultAudioByAudioId(req.body.defaultAudioId)
            if (!defaultAudioData.status) {
                return badRequest(res, defaultAudioData.message)
            }
            const mergeAudioResponse = await mergeAudio(defaultAudioData.data, req.file);
            // if (mergeAudioResponse) {
            //     return badRequest(res, "please provide proper felids")
            // }
            // } else {
            // location = Location
            // }
            // let saveData = true
            const { Location } = await uploadAudio(mergeAudioResponse);
            const saveData = await addAudio(userId, req.body, Location);
            return saveData ? created(res, "audio added") : badRequest(res, "please provide proper feilds");
        } catch (error) {
            console.log(error);
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
    },
    defaultAudioAdd: async (req, res) => {
        try {
            const { title } = req.body
            const { status, message } = await addDefaultAudio(title);
            return status ? created(res, message) : badRequest(res, message);
        } catch (error) {
            return unknownError(res, error.message);
        }
    },
    getDefaultAudio: async (req, res) => {
        try {
            const { status, message, data } = await getDefaultAudioList(req.body.audioId);
            return status ? created(res, message, data) : badRequest(res, message);
        } catch (error) {
            return unknownError(res, error.message);
        }
    }
}