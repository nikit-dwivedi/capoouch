const userModel = require('../models/user.model');
const { randomBytes } = require('node:crypto');
const { encryption, generateUserToken, checkEncryption, generateVerifiedyUserToken } = require('../middlewares/authToken');
const { sendMail } = require('../services/mail.service');
const { getPetInfo } = require('./pet.helper');

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
        const date = new Date
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const updatedData = await userModel.findOne({ email })
        if (updatedData.noOfOtp >= 3 && updatedData.date == date.getDate()) {
            return 1
        }
        updatedData.otp = otp;
        updatedData.reqId = reqId;
        updatedData.noOfOtp += 1
        updatedData.date = date.getDate()
        const saveData = await updatedData.save()
        if (!saveData) {
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
            const token = generateVerifiedyUserToken(userData);
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
            console.log(passwordCheck);
            if (!passwordCheck) {
                return false;
            }
            if (userData.isVerified) {
                userData.isLogin = true
                await userData.save()
                const token = generateVerifiedyUserToken(userData);
                const petInfo = await getPetInfo(userData.userId);
                return petInfo ? { token: token, isVerified: true, petAdded: true } : { token: token, isVerified: true, petAdded: false }
            }
            const token = generateUserToken(userData);
            const reqId = await genrateOtp(userData.email)
            userData.isLogin = true
            await userData.save()
            return { token: token, isVerified: false, petAdded: false, reqId: reqId };
        }
        catch (error) {
            return false
        }
    },
    checkByEmail: async (email) => {
        try {
            const userData = await userModel.findOne({ email })
            return userData ? userData : false;
        } catch (error) {
            return true
        }
    },
    checkByUsername: async (username) => {
        try {
            const userData = await userModel.findOne({ username })
            return userData ? userData : false;
        } catch (error) {
            return false
        }
    },
    verifyOtp: async (reqId, otp) => {
        try {
            const newReqId = randomBytes(4).toString('hex')
            const userData = await userModel.findOne({ reqId });
            if (!userData) {
                return false
            }
            if (userData.otp == otp) {
                const token = generateUserToken(userData);
                userData.noOfOtp = 0
                userData.otp=0
                userData.reqId = newReqId
                await userData.save()
                return token
            }
            return false
        } catch (error) {
            return false
        }
    },
    changePassword: async (email, oldPassword, newPassword) => {
        try {
            const userData = await userModel.findOne({ email });
            if (oldPassword) {
                const passwordCheck = await checkEncryption(oldPassword, userData.password);
                if (!passwordCheck) {
                    return false
                }
            }
            const encryptedPassword = await encryption(newPassword);
            userData.password = encryptedPassword;
            return await userData.save() ? true : false
        } catch (error) {
            return false
        }
    }

}
const genrateOtp = async (email) => {
    try {
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const updatedData = await userModel.findOneAndUpdate({ email }, { otp, reqId })
        if (!updatedData) {
            return false
        }
        await sendMail(email, otp)
        return reqId
    } catch (error) {
        return false
    }
}