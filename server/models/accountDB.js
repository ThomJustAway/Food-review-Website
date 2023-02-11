"use strict";

var db = require("../db-connections");

class AccountDB {
    getAccount(id, callback) {
        var sql = `
        SELECT
        A.id_account,
        A.username,
        A.email,
        A.password,
        A.first_name,
        A.last_name,
        A.profile,
        A.date,
        T.type AS like_type1,
        T1.type as like_type2,
        T2.type as like_type3,
        
        (
        SELECT  
        json_arrayagg(json_object(
					"followerAccountId",A.id_account,
					"followerUsername",A.userName,
                    "followerProfile",A.profile))
        FROM account_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_account_follower = A.id_account
        where  Rl.id_account_host=?
        ) as "Follower",
        (
        SELECT  
        json_arrayagg( Json_Object("followingAccountID",A.id_account,
									"followingUserName",A.userName,
									"followingProfile",A.profile))
        FROM account_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_account_host = A.id_account
        WHERE rl.id_account_follower=?
        ) as "Following",
        (
        SELECT  
        json_arrayagg(json_object(
					"BlockAccountId",A.id_account,
					"BlockUserName",A.userName,
                    "BlockProfile",A.profile))
        FROM block_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_follower_block = A.id_account
        where  Rl.id_account_host=?
        ) as "Blocked Account",
        (
        SELECT  
        json_arrayagg(json_object(
					"BlockerId",A.id_account,
					"BlockerName",A.userName,
                    "BlockerProfile",A.profile))
        FROM block_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_account_host = A.id_account
        where  Rl.id_follower_block=?
        ) as "Account that block user"
        
        FROM 
        account AS A
        left JOIN type AS T 
            ON A.like_type1 = T.id_type 
        JOIN type as T1 ON A.like_type2 = T1.id_type 
        JOIN type as T2 ON A.like_type3= T2.id_type

         WHERE A.id_account =?`;
        db.query(sql, [id, id, id, id, id], callback);
    }

    getOtherPeopleAccount(id, callback) {
        var sql = `SELECT
        A.id_account,
        A.username,
        A.profile,
        A.date,
        T.type AS like_type1,
        T1.type as like_type2,
        T2.type as like_type3,
        (
        SELECT  
        json_arrayagg(json_object(
					"followerAccountId",A.id_account,
					"followerUsername",A.userName,
                    "followerProfile",A.profile))
        FROM account_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_account_follower = A.id_account
        where  Rl.id_account_host=?
        ) as "Follower",
        (
        SELECT  
        json_arrayagg( Json_Object("followingAccountID",A.id_account,
									"followingUserName",A.userName,
									"followingProfile",A.profile))
        FROM account_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_account_host = A.id_account
        WHERE rl.id_account_follower=?
        ) as "Following",
        (
        SELECT  
        json_arrayagg(json_object(
					"BlockAccountId",A.id_account,
					"BlockUserName",A.userName,
                    "BlockProfile",A.profile))
        FROM block_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_follower_block = A.id_account
        where  Rl.id_account_host=?
        ) as "Blocked Account",
        (
        SELECT  
        json_arrayagg(json_object(
					"BlockerId",A.id_account,
					"BlockerName",A.userName,
                    "BlockerProfile",A.profile))
        FROM block_follower as Rl
        LEFT JOIN account as A 
        ON Rl.id_account_host = A.id_account
        where  Rl.id_follower_block=14
        ) as "Account that block user",
        (SELECT
        json_arrayagg(json_object(
					"id_restaurant",R.id_restaurant,
                    "name",R.name,
                    "img_rest",R.img_rest
        ))
        FROM restaurant as R
        RIGHT JOIN restaurant_like as RL on R.id_restaurant = RL.id_restaurant
        WHERE RL.id_account=?
        ) as "favouriteRestaurant"
        
        
        FROM 
        account AS A
        left JOIN type AS T 
            ON A.like_type1 = T.id_type 
        JOIN type as T1 ON A.like_type2 = T1.id_type 
        JOIN type as T2 ON A.like_type3= T2.id_type

         WHERE A.id_account =?`
        db.query(sql, [id, id, id, id, id, id], callback);
    }

    getLikeRestaurant(id, callback) {
        console.log(id)
        var getLikedRestaurant = `
        SELECT 
        R.id_restaurant,
        R.name,
        R.img_rest,
        R.location,
        R.location_url,
        R.cost,	
        COUNT(RR.id_account) as count_Of_Review,
        avg(RR.rating) as Rating,
        RM.menu_link
        FROM restaurant_review AS RR
        RIGHT JOIN restaurant AS R ON  R.id_restaurant = RR.id_restaurant
        LEFT JOIN restaurant_menu as RM ON RM.restaurant_id = R.id_restaurant
        LEFT JOIN restaurant_like AS RL ON RL.id_restaurant = R.id_restaurant
        WHERE RL.id_restaurant IN (
        SELECT id_restaurant 
        FROM restaurant_like
        WHERE id_account = ?)
        GROUP BY 
        RL.id_restaurant`
        db.query(getLikedRestaurant, [id], callback)
    }

    getBookMarkRestaurant(id, callback) {
        var sql = `SELECT 
        R.id_restaurant,
        R.name,
        R.img_rest,
        R.location,
        R.location_url,
        R.cost,	
        COUNT(RR.id_account) as count_Of_Review,
        avg(RR.rating) as Rating,
        RM.menu_link
        FROM restaurant_review AS RR
        RIGHT JOIN restaurant AS R ON  R.id_restaurant = RR.id_restaurant
        LEFT JOIN restaurant_menu as RM ON RM.restaurant_id = R.id_restaurant
        LEFT JOIN restaurant_bookmark AS RB ON RB.id_restaurant = R.id_restaurant
        WHERE RB.id_account IN (
        SELECT id_restaurant 
        FROM restaurant_bookmark
        WHERE id_account = ?)
        GROUP BY 
        RR.id_restaurant`
        db.query(sql, [id], callback)
    }//dont use this

    getAccountByEmail(email, callback) {
        var sql = "SELECT id_account FROM ACCOUNT WHERE email = ?"
        db.query(sql, [email], callback)
    }

    getAllEmail(callback) {
        var sql = `SELECT email
        FROM account`
        db.query(sql, callback)
    }

    updateAccount(account, callback) {
        var sql = `UPDATE ACCOUNT SET username = ? ,
                                        email =? ,
                                        password = ?,
                                        first_name =?,
                                        last_name = ?,
                                        date =? , 
                                        like_type1=?,
                                        like_type2 =?,
                                        like_type3 =?
                                    WHERE id_account = ?;`
        db.query(sql, [account.getUsername(),
        account.getEmail(),
        account.getPassword(),
        account.getFirst_name(),
        account.getLast_name(),
        account.getDate(),
        account.getLike_type()[0],
        account.getLike_type()[1],
        account.getLike_type()[2],
        account.getId()
        ], callback)
    }

    resetPassword(id, password, callback) {
        var sql = `UPDATE ACCOUNT SET
        password=? 
        WHERE id_account = ?`
        db.query(sql, [password, id], callback)
    }

    updateProfile(imageName, account, callback) {
        var sql = `UPDATE ACCOUNT SET
        profile=? 
        WHERE id_account = ?`
        db.query(sql, [imageName, account], callback)
    }


    createAccount(account, callback) {
        var sql = `INSERT INTO ACCOUNT(
            username,
            email,
            password,
            first_name,
            last_name,
            profile,
            date,
            like_type1,
            like_type2,
            like_type3)
            values(?,?,?,?,?,?,?,?,?,?)`
        db.query(sql,
            [account.getUsername(),
            account.getEmail(),
            account.getPassword(),
            account.getFirst_name(),
            account.getLast_name(),
            account.getProfile(),
            account.getDate(),
            account.getLike_type()[0],
            account.getLike_type()[1],
            account.getLike_type()[2]
            ], callback)
    }

    login(email, callback) {
        var sql = "SELECT password,id_account FROM ACCOUNT WHERE email = ?"
        db.query(sql, [email], callback)
    }

    deleteAccount(id, callback) {
        var sql = "DELETE FROM account WHERE id_account=?"
        db.query(sql, [parseInt(id)], callback)
    } //delete account

    getFollower(id, callback) {
        var sql = `SELECT 
        AF.id_account_host as Host_account,
        AF.id_account_follower as Follower_account,
        A.username
        FROM mydb.account_follower as AF
        JOIN account as A ON A.id_account = AF.id_account_follower
        WHERE id_account_host = ?`
        db.query(sql, [id], callback)
    } //get a list of people that follow you

    getBlockFollower(id, callback) {
        var sql = `SELECT 
        AF.id_account_host as Host_account,
        AF.id_follower_block as Follower_account,
        A.username
        FROM mydb.block_follower as AF
        JOIN account as A ON A.id_account = AF.id_follower_block
        WHERE id_account_host = ?`
        db.query(sql, [id], callback)
    } // get a list of people that is block by the user

    getFollowing(id, callback) {
        console.log(id)
        var sql = `SELECT 
        AF.id_account_host as Host_account,
        AF.id_account_follower as Follower_account,
        A.username
        FROM mydb.account_follower as AF
        JOIN account as A ON A.id_account = AF.id_account_host
        WHERE id_account_follower = ?`
        db.query(sql, [id], callback)
    }// get a list of people that the user follow

    followAccount(host_account, Follower_account, callback) {
        var sql = `INSERT INTO account_follower
        VALUES(?,?)`
        db.query(sql, [Follower_account, host_account], callback);
    }//follow a certain account

    block_account(host_account, block_account, callback) {
        var sql = `INSERT INTO block_follower
        VALUES(?,?)`
        db.query(sql, [host_account, block_account], callback)
    }

    unfollowAccount(host_account, unfollower_account, callback) {
        var sql = `DELETE FROM account_follower WHERE 
        id_account_host= ? AND id_account_follower=?`
        db.query(sql, [host_account, unfollower_account], callback)
    } //unfollow a certain account

    unblockAccount(host_account, block_account, callback) {
        var sql = `DELETE FROM block_follower WHERE 
        id_account_host= ? AND id_follower_block=?`
        db.query(sql, [host_account, block_account], callback)
    } //unblock a certain account


    //for finding users
    findingUser(search, id, callback) {
        var sql;
        if (search === "") {
            sql = `SELECT 
            id_account as id,
            username,
            profile
            FROM 
            mydb.account
            WHERE 
            id_account != ${id}
            AND id_account NOT IN (
            SELECT 
            id_account_host
            from account_follower
            WHERE id_account_follower =${id}
            )
            `
        }
        else {
            sql = `
            SELECT 
            id_account as id,
            username,
            profile
            FROM 
            mydb.account
            WHERE username REGEXP ?
            AND
            id_account != ${id}
            AND id_account NOT IN (
            SELECT 
            id_account_host
            from account_follower
            WHERE id_account_follower =${id})
            `
        }
        db.query(sql, [search], callback)
    }

}

module.exports = AccountDB;

