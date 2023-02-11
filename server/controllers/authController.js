var jwt = require("jsonwebtoken");
require('dotenv').config();
const AccountDB = require("../models/accountDB")
const bcrypt = require('bcrypt');

let AvalibleRefreshToken = [];
var accountDB = new AccountDB();

//add delete token function


function refreshAccessToken(req, res) {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) {
        res.sendStatus(401)
    }
    else if (!AvalibleRefreshToken.includes(refreshToken)) {
        res.sendStatus(401);
    }
    else {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            // Generate a new access token
            const accessToken = generateAccessToken(decoded.id)
            res.json({ accessToken: accessToken });

        } catch (error) {
            res.status(401).json({ message: 'Invalid refresh token' });
        }
    }

}
//     //add condition refresh token db 

// }
// function forgetPassword(req,res){
//     const email = req.body.email
//     const hashPassword = req.body.password
//     bcrypt.
// }
function logOut(req, res) {
    const refreshToken = req.body.refreshToken
    AvalibleRefreshToken = AvalibleRefreshToken.filter(token => token != refreshToken)
    res.sendStatus(200)
}

function login(req, res) {
    const email = req.body.email
    const password = req.body.password
    const email_verfied = req.body.email_verfied
    accountDB.login(email, (error, result) => {
        if (error) res.json(error);
        else {
            if (result == 0) res.sendStatus(404)
            else {
                const id_account = result[0].id_account
                if (email_verfied) {
                    let token = generateAccessToken(id_account);
                    let refreshToken = generateRefreshToken(id_account);
                    AvalibleRefreshToken.push(refreshToken);
                    res.json({
                        result: token,
                        refreshToken: refreshToken
                    });
                }//improve this line of code
                else {
                    const hash = result[0].password;
                    const flag = bcrypt.compareSync(password, hash);
                    if (flag) {
                        let token = generateAccessToken(id_account);
                        let refreshToken = generateRefreshToken(id_account);
                        AvalibleRefreshToken.push(refreshToken);
                        res.json({
                            result: token,
                            refreshToken: refreshToken
                        });
                    }
                    else {
                        res.json({ result: "Invalid" })
                    }
                }
            }
        }
    })
}

function generateRefreshToken(id) {
    const id_string = String(id);
    return jwt.sign({ id: id_string }
        , process.env.REFRESH_TOKEN_SECRET);
}

function generateAccessToken(id) {
    const id_string = String(id);
    return jwt.sign({ id: id_string },
        process.env.ACCESS_TOKEN_SECRET
        , { expiresIn: '10d' });
    //add , { expiresIn: '30s' } if you planning to do more auth
}

module.exports = {
    login,
    generateAccessToken,
    refreshAccessToken,
    logOut
}