const nodemailer = require('nodemailer');
const { google } = require("googleapis");
require('dotenv').config();


const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_Secret = process.env.CLIENT_Secret;
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_SECRET;
const oAuth2CLient = new google.auth.OAuth2(CLIENT_ID, CLEINT_Secret, REDIRECT_URL);
oAuth2CLient.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(email, pin) {
    try {
        const accessToken = await oAuth2CLient.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: //email here,
                clientId: CLIENT_ID,
                clientSecret: CLEINT_Secret,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: "Sweet Fanatasy //email",
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
                user: //email,
                clientId: CLIENT_ID,
                clientSecret: CLEINT_Secret,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: "Sweet Fanatasy ",
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

