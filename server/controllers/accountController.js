const AccountDB = require("../models/accountDB")
const Account = require("../models/account");
require('dotenv').config({
    path: '../.env'
});
const sendMail = require('../models/mail')
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const account = require("../models/account");
const { generateAccessToken } = require("./authController");


var accountDB = new AccountDB();

function getAccount(req, res) {
    accountDB.getAccount(req.body.token,
        function (error, result) {
            if (error) throw res.json(error);
            else {
                let data = eval(result[0].Follower);
                res.json(result)
            }
        })
}

function getOtherPeopleAccount(req, res) {
    accountDB.getOtherPeopleAccount(req.params.id,
        function (error, result) {
            if (error) res.json(error);
            else res.json(result);
        })
}

function getLikeRestaurant(req, res) {

    accountDB.getLikeRestaurant(req.body.token,
        function (error, result) {
            if (error) throw res.json(error)
            else res.json(result)
        })
}

function getBookMarkedRestaurant(req, res) {
    accountDB.getBookMarkRestaurant(req.params.account_id,
        function (error, result) {
            if (error) throw res.json(error)
            else res.json(result)
        })
}

function getAccountByEmail(email) {

    return new Promise((resolve, reject) => {
        accountDB.getAccountByEmail(email.trim(),
            function (error, result) {

                if (error) {
                    throw reject(error);
                }
                else {
                    try {
                        let id = result[0].id_account
                        const token = generateAccessToken(id)
                        resolve(token);
                    }
                    catch (error) {
                        resolve("Not valid email")
                    }

                }
            })

    })

}

function updateProfile(req, res) {

    accountDB.updateProfile(
        req.body.fileName,
        req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        }
    )
}

function getAllEmail(req, res) {
    accountDB.getAllEmail(function (error, result) {
        if (error) throw res.json(error)
        else res.json(result)
    })
}

function updateAccount(req, res) {
    const ignorePassword = req.body.ignorepassword;
    let account
    if (ignorePassword) {
        var now = new Date();
        const id_account = req.body.token //getting the id from the token
        const email = req.body.email;
        account = new Account(parseInt(id_account),
            req.body.username,
            email,
            req.body.password,
            req.body.first_name,
            req.body.last_name,
            req.body.profile,
            now.toString(),
            req.body.like_type1,
            req.body.like_type2,
            req.body.like_type3)
    }
    else {
        var now = new Date();
        const id_account = req.body.token //getting the id from the token
        const email = req.body.email;
        const password = bcrypt.hashSync(req.body.password, 10);
        account = new Account(parseInt(id_account),
            req.body.username,
            email,
            password,
            req.body.first_name,
            req.body.last_name,
            req.body.profile,
            now.toString(),
            req.body.like_type1,
            req.body.like_type2,
            req.body.like_type3)
    }
    accountDB.updateAccount(account, function (error, result) {
        if (error) throw res.json(error);
        else res.json(result);
    })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        if (err) return res.sendStatus(401);
        req.body.token = token.id;
        next();
    })
}

function createAccount(req, res) {
    var now = new Date();
    var password = req.body.password;
    password = bcrypt.hashSync(password, 10)
    let account = new Account(null,
        req.body.username,
        req.body.email,
        password,
        req.body.first_name,
        req.body.last_name,
        req.body.profile,
        now.toString(),
        req.body.like_type1,
        req.body.like_type2,
        req.body.like_type3)
    console.log(account)
    accountDB.createAccount(account,
        function (error, result) {
            if (error) throw res.json(error);
            else res.json(result);
        })
}

function deleteAccount(req, res) {
    accountDB.deleteAccount(req.body.token, function (error, result) {
        if (error) res.json(error);
        else res.json(result);
    })
}

function getFollower(req, res) {
    console.log(req)
    accountDB.getFollower(req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function getBlockFollower(req, res) {
    console.log(req.body.token)
    accountDB.getBlockFollower(req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function getFollowing(req, res) {

    accountDB.getFollowing(req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function followAccount(req, res) {
    accountDB.followAccount(req.body.token,
        req.params.follower_account,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function blockaccount(req, res) {
    accountDB.block_account(req.body.token,
        req.params.block_account,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function unfollowAccount(req, res) {
    accountDB.unfollowAccount(req.params.unfollower_account,
        req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function unblockAccount(req, res) {
    accountDB.unblockAccount(req.body.token,
        req.params.block_account,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function resetPassword(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    accountDB.resetPassword(req.body.token,
        password, function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        }
    )
}

//special\

function getSearch(req, res) {
    accountDB.findingUser(
        req.body.search,
        req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        }
    )
}


function sendPin(req, res) {
    sendMail.sendMail(req.params.email, req.params.pin)
        .then(result => res.json({ result: "successful" }))
        .catch(error => res.json(error))
}

function sendingVerification(token) {
    const id = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        if (err) return "unAuthorized"
        return token.id;
    })
    return id
}

function sendForgetPassword(req, res) {
    getAccountByEmail(req.params.email)
        .then(resultT => {
            if (resultT === "Not valid email") {
                res.json({ result: "Not valid email" })
            }
            else {
                sendMail.sendForgetPassword(req.params.email, resultT)
                    .then((result) => {
                        if (result.result != 'invalid') {
                            res.json({ result: "successful" })
                        }
                        else {
                            res.json({ result: "invalid" })
                        }
                    })
            }
        }).catch(error => {
            console.log(error)
            res.json({ result: "invalid" })
        })
}

module.exports = {
    getAccount,
    getLikeRestaurant,
    getBookMarkedRestaurant,
    getAccountByEmail,
    updateAccount,
    createAccount,
    deleteAccount,
    getFollower,
    getBlockFollower,
    getFollowing,
    followAccount,
    blockaccount,
    unfollowAccount,
    unblockAccount,
    authenticateToken,
    getAllEmail,
    sendPin,
    updateProfile,
    getSearch,
    getOtherPeopleAccount,
    sendingVerification,
    sendForgetPassword,
    resetPassword
}



