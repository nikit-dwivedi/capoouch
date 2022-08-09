const userModel = require('../models/user.model');
const { randomBytes } = require('node:crypto');
const { encryption, generateUserToken, checkEncryption } = require('../middlewares/authToken');
const { sendMail } = require('../services/mail.service');

module.exports = {
    addUser: async (bodyData) => {
        try {
            const userId = randomBytes(4).toString('hex')
            const otp = Math.floor(Math.random() * (999999 - 100000) + 100000)
            const reqId = randomBytes(4).toString('hex')
            const encryptedPassword = await encryption(bodyData.password)
            const formattedData = {
                userId: userId,
                username: bodyData.username,
                password: encryptedPassword,
                email: bodyData.email,
                otp: otp,
                reqId: reqId
            }
            const saveData = await userModel(formattedData);
            await sendMail(bodyData.email,otp)
            return await saveData.save() ? reqId : false;
        } catch (error) {
            return false
        }
    },
    verifyEmail: async (reqId, otp) => {
        try {
            const userData = await userModel.findOne({ reqId });
            if (!userData) {
                return false
            }
            const token = generateUserToken(userData);
            return (userData.otp == otp) ? token : false
        } catch (error) {
            return false
        }
    },
    checkLogin: async (username, password) => {
        try {
            const userData = await userModel.findOne({ username });
            if (!userData) {
                return false;
            }
            const token = generateUserToken(userData);
            const passwordCheck = await checkEncryption(password, userData.password);
            userData.isLogin = true
            await userData.save()
            return passwordCheck ? token : false;
        }
        catch (error) {
            return false
        }
    }
}