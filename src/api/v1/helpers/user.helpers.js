const userModel = require('../models/user.model');
const { randomBytes } = require('node:crypto');
const { encryption, generateUserToken, checkEncryption, generateVerifiedyUserToken } = require('../middlewares/authToken');
const { sendMail } = require('../services/mail.service');

module.exports = {
    addUser: async (bodyData) => {
        try {
            const userId = randomBytes(4).toString('hex')
            const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
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
            await sendMail(bodyData.email, otp)
            return await saveData.save() ? reqId : false;
        } catch (error) {
            return false
        }
    },
    genrateOtp: async (email) => {
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const updatedData = await userModel.findOneAndUpdate({ email }, { otp, reqId })
        if (!updatedData) {
            return false
        }
        await sendMail(email, otp)
        return reqId
    },
    verifyEmail: async (reqId, otp) => {
        try {
            const userData = await userModel.findOne({ reqId });
            if (!userData) {
                return false
            }
            if (userData.otp != otp) {
                return false
            }
            const token = generateUserToken(userData);
            userData.isVerified = true;
            userData.save()
            return token
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
            const passwordCheck = await checkEncryption(password, userData.password);
            if (!passwordCheck) {
                return false;
            }
            if (userData.isVerified) {
                userData.isLogin = true
                await userData.save()
                const token = generateVerifiedyUserToken(userData);
                return { token: token, isVerified: true }
            }
            const token = generateUserToken(userData);
            userData.isLogin = true
            await userData.save()
            return { token: token, isVerified: false }
        }
        catch (error) {
            return false
        }
    },
    checkByEmail: async (email) => {
        try {
            const userData = await userModel.findOne({ email })
            console.log(userData);
            return userData ? userData : false;
        } catch (error) {
            return true
        }
    },
    checkByUsername: async (username) => {
        try {
            const userData = await userModel.findOne({ username })
            console.log(userData);
            return userData ? userData : false;
        } catch (error) {
            return false
        }
    },

}