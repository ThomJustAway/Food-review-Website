let db = require("../db-connections");

class MainDB {
    globalSearch(search, callback) {
        let sql = `SELECT lower(TRIM(BOTH ' ' FROM  name)) as name,
        id_restaurant as id,"restaurant" as type ,
        img_rest as image FROM restaurant 
        WHERE name regexp ?
        UNION
        SELECT username,
        id_account,
        "account" as type,
        profile FROM account
        WHERE username regexp ?`

        db.query(sql, [search, search], callback)
    }
}

module.exports = MainDB;