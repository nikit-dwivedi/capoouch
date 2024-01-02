const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (email, otp) => {
    try {
        const msg = {
            to: email,
            from: '',
            templateId: '',
            dynamicTemplateData: {
                otp: otp,
            },
        }
        await sgMail.send(msg)
    } catch (error) {
        console.log(error);
    }
}


module.exports = { sendMail }


