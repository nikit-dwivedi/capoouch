const { validationResult } = require("express-validator")
const { unknownError, badRequest, success, created } = require("../helpers/response_helper");
const { addUser, verifyEmail, checkLogin, checkByEmail, checkByUsername, verifyOtp, changePassword, genrateOtp } = require("../helpers/user.helpers");
const { parseJwt } = require("../middlewares/authToken");

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
            return formSubmission ? created(res, "otp send", { reqId: formSubmission }) : badRequest(res, "please provide proper fields")
        } catch (error) {
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
    },
    sendOtp: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper fields")
            }
            const { email } = req.body
            const userCheck = await checkByEmail(email);
            if (!userCheck) {
                return badRequest(res,"email doesn't exists")
            }
            const reqId = await genrateOtp(email);
            return reqId ? success(res, "otp send successfully", reqId) : badRequest(res, "please provide proper fields")
        } catch (error) {
            console.log(error);
            return unknownError(res, "unknow error")
        }
    },
    otpVerification: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper fields")
            }
            const { reqId, otp } = req.body
            const verification = await verifyOtp(reqId, otp)
            // const token
            return verification ? success(res, "otp verified",verification) : badRequest(res, "invalid otp")
        } catch (error) {
            unknownError(res, "unknown error")
        }
    },
    changeCurrentPassword: async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return badRequest(res, "please provide proper fields")
            }
            const token = parseJwt(req.headers.authorization)
            const {email} = await checkByUsername(token.username)
            if (token.isLogin) {
                const updatePassword = await changePassword(email, req.body.oldPassword, req.body.newPassword);
                return updatePassword ? success(res, "password changed successfully") : badRequest(res, "please provide proper fields")
            }
            const updatePassword = await changePassword(email, null, req.body.newPassword);
            return updatePassword ? success(res, "password changed successfully") : badRequest(res, "please provide proper fields")
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    }
}