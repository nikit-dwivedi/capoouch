const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (email, otp) => {
    try {
        const msg = {
            to: email,
            from: 'nikitdwivedi@fabloplatforms.com',
            templateId: 'd-4aae71d774b945e48cf3c6cdbc8dee0e',
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


