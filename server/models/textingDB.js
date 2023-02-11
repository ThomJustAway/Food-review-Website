"use strict";

const db = require("../db-connections")

class TextingDB {

    getText(host_account, other_account, callback) {

        var sql = `SELECT 
        T.id_texting,
        T.text,
        T.date,
        A.username as "Host",
        A1.username as "textingAccount",
        A1.id_account as "textingId",
        A.profile 
        FROM texting as T
        JOIN account as A ON A.id_account = T.host_account
        JOIN account as A1 ON A1.id_account = T.other_account
        WHERE host_account in (?,?) 
        and other_account in (?,?)
        order by date
        `
        db.query(sql, [host_account,
            other_account,
            host_account,
            other_account],
            callback)
    }

    createText(host_account, other_account, text, callback) {

        var sql = `INSERT INTO texting
        (host_account,other_account,text,date)
        VALUES(?,?,?,now())`
        db.query(sql, [host_account, other_account, text], callback)
    }

    deleteText(id_texting, callback) {
        var sql = `DELETE FROM texting WHERE id_texting = ?`
        db.query(sql, [id_texting], callback)
    }

    checkIfBlock(account, follwer_block, callback) {
        var sql = `SELECT * FROM mydb.block_follower 
        WHERE id_account_host=? and id_follower_block=? ;`
        db.query(sql, [account, follwer_block], callback);
    }

}

module.exports = TextingDB;