const nodemailer = require('nodemailer');
const { google } = require("googleapis");

const CLIENT_ID = "372509600391-devhictlio3tqt3fo8gjacrbhn4c1o31.apps.googleusercontent.com";
const CLEINT_Secret = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04cY5pitgWlYmCgYIARAAGAQSNwF-L9IrSFKO1RByXJp-wTURVv5Pg-8_FB47m3bwU8irR00GE44iUIlM76KPJoSMLS-jQNo4e0I";
const oAuth2CLient = new google.auth.OAuth2(CLIENT_ID, CLEINT_Secret, REDIRECT_URL);
oAuth2CLient.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(email, pin) {
    try {
        const accessToken = await oAuth2CLient.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "thomthomlow@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLEINT_Secret,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: "Sweet Fanatasy <thomthomlow@gmail.com>",
            to: email,
            subject: "Pin Number",
            text: `Hello and Welcome to Sweet fantasy`,
            html: `<p>Hello. Your pin Number is ${pin}</p>`
        };

        const result = await transport.sendMail(mailOptions);
        return result

    }
    catch (error) {
        return error
    }
}

async function sendForgetPassword(email, token) {
    try {
        const accessToken = await oAuth2CLient.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "thomthomlow@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLEINT_Secret,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: "Sweet Fanatasy <thomthomlow@gmail.com>",
            to: email,
            subject: "Resetting Password",
            text: `You have requested for a reset password!`,
            html: `<p>Hello. here is the link to reset your password! 
            <a href=http://localhost:3000/forgetPassword/${token}>click here!</a>
            </p>`
        };

        const result = await transport.sendMail(mailOptions);
        return result
    }
    catch (error) {//{ result: "invalid" }
        return error
    }
}



module.exports = { sendMail, sendForgetPassword }

