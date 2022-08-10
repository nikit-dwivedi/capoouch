const { validationResult } = require("express-validator")
const { unknownError, badRequest, success } = require("../helpers/response_helper");
const { addUser, verifyEmail, checkLogin, checkByEmail, checkByUsername } = require("../helpers/user.helpers");

module.exports = {
    register: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper fields");
            };
            const emailCheck = await checkByEmail(req.body.email);
            const usernameCheck = await checkByUsername(req.body.username);
            if (emailCheck && usernameCheck) {
                
                return badRequest(res, "email and username already exists")
            } else if (emailCheck) {
                return badRequest(res, "email already exists")
            } else if (usernameCheck) {
                return badRequest(res, "username already exists")
            }
            const formSubmission = await addUser(req.body);
            return formSubmission ? success(res, "otp send", { reqId: formSubmission }) : badRequest(res, "please provide proper fields")
        } catch (error) {
            console.log(error);
            return unknownError(res, "unknow error")
        }
    },
    emailVerification: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper fields");
            }
            const { reqId, otp } = req.body
            const token = await verifyEmail(reqId, otp)
            return token ? success(res, "otp verified", token) : badRequest(res, "otp not verified");
        } catch (error) {
            unknownError(res, "unknown error")
        }
    },
    login: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper fields");
            }
            const { username, password } = req.body;
            const responseData = await checkLogin(username, password);
            return responseData ? success(res, "login successful", responseData) : badRequest(res, "invalid credentials")
        } catch (error) {
            return unknownError(res, "unknown error");
        }
    }
}