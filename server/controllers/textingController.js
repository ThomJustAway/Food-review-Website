"use strict";

const TextingDB = require('../models/textingDB');
let textingDB = new TextingDB;

// function callback(res) {
//     (error, result) => {
//         if (error) res.json(error)
//         else res.json(result)
//     }
// }

function getText(req, res) {
    textingDB.getText(req.body.token,
        req.params.other_account,
        function (error, result) {
            if (error) res.json(error);
            else res.json(result)
        });
}

function createText(req, res) {
    textingDB.createText(req.params.host_account,
        req.params.other_account,
        req.body.text, function (error, result) {
            if (error) res.json(error);
            else res.json(result)
        }
    )
}

function deleteText(req, res) {
    textingDB.deleteText(req.params.id_text, function (error, result) {
        if (error) res.json(error);
        else res.json(result)
    })
}

function checkIfBlock(req, res) {
    textingDB.checkIfBlock(req.params.account,
        req.params.block_account,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

module.exports = { getText, createText, deleteText, checkIfBlock }