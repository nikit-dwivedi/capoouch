const { validationResult } = require("express-validator")
const { unknownError, badRequest, success } = require("../helpers/response_helper");
const { userByEmail, addUser } = require("../helpers/user.helpers");

module.exports = {
    register: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper fields");
            };
            const emailCheck = userByEmail(req.body.email);
            const usernameCheck = userByEmail(req.body.username);
            if (emailCheck && usernameCheck) {
                return badRequest(res, "email and username already exists")
            } else if (emailCheck) {
                return badRequest(res, "email already exists")
            } else if (usernameCheck) {
                return badRequest(res, "username already exists")
            }
            const formSubmission = await addUser(req.body);
            return formSubmission ? success(res, "otp send", { reqId: formSubmission }):badRequest(res,"please provide proper fields")
        } catch (error) {
            return unknownError(res, "unknow error")
        }
    }
}