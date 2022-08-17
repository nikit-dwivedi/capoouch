const { validationResult } = require("express-validator")
const { unknownError, badRequest, success } = require("../helpers/response_helper");
const { homePage } = require("../helpers/screen.helper");
const { parseJwt } = require("../middlewares/authToken");

module.exports = {
    home: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "bad request")
            }
            const token = parseJwt(req.headers.authorization)
            const homeData = await homePage(token.userId);
            return homeData ? success(res, "success", homeData) : badRequest(res, "bad request");
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    }
}