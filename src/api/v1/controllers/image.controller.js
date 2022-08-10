const { validationResult } = require("express-validator");
const { addIcon, addAvatar, getAllIcon, getAllAvatar } = require("../helpers/image.helper");
const { badRequest, created, unknownError, success } = require("../helpers/response_helper");

module.exports = {
    addNewIcon: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const { image } = req.body;
            const imageSave = await addIcon(image);
            return imageSave ? created(res, "icon added") : badRequest(res, "please provide proper feilds");
        } catch (error) {
            return unknownError(res, "unknown error");
        }
    },
    addNewAvatar: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const { image } = req.body;
            const imageSave = await addAvatar(image);
            return imageSave ? created(res, "avatar added") : badRequest(res, "please provide proper feilds");
        } catch (error) {
            return unknownError(res, "unknown error");
        }
    },
    getIconList: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const iconList = await getAllIcon();
            return iconList ? success(res, "icon list", iconList) : badRequest(res, "no icon found");
        } catch (error) {
            return unknownError(res, "unknown error");
        }
    },
    getAvatarList: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper feilds");
            }
            const avatarList = await getAllAvatar();
            return avatarList ? success(res, "avatar list", avatarList) : badRequest(res, "no avatar found");
        } catch (error) {
            return unknownError(res, "unknown error");
        }
    }
}