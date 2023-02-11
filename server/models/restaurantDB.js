"use strict";

var db = require("../db-connections");

class RestaurantDB {
    getAllRestaurant(callback) {
        var sql = `SELECT 
        R.id_restaurant,
        R.name,
        R.img_rest,
        R.location,
        R.distinct_location as Region,
        R.location_url,
        R.cost,	
        RT1.type as type1,
        RT2.type as type2,
        RT3.type as type3,
        COUNT(RR.id_account) as count_Of_Review,
        avg(RR.rating) as Rating,
        RM.menu_link,
        count(RL.id_account) as popularity
        FROM restaurant_review AS RR
        RIGHT JOIN restaurant AS R ON  R.id_restaurant = RR.id_restaurant
        LEFT JOIN restaurant_menu as RM ON RM.restaurant_id = R.id_restaurant
        LEFT JOIN type as RT1 ON RT1.id_type = R.type1
		LEFT JOIN type as RT2 ON RT2.id_type = R.type2
        LEFT JOIN type as RT3 ON RT3.id_type = R.type3
        LEFT JOIN restaurant_like as RL ON R.id_restaurant = RL.id_restaurant

        GROUP BY 
        R.id_restaurant
    `;
        db.query(sql, callback);
    }//Get all the restaurant avaliable

    getSearchRestaurant(search, filter, district, sort, callback) {
        if (search == "") search = '^[A-Za-z0-9]'
        if (filter == "") {
            filter = "RT1.id_type"
        }
        else {
            if (typeof (filter) != "string") {
                filter = filter.join(',');
            }
        }
        if (district == 0) {
            district = "R.distinct_location"
            var sql = `
            SELECT 
            R.id_restaurant,
            R.name,
            R.img_rest,
            R.location,
            R.location_url,
            R.distinct_location as region,
            R.cost,	
            RT1.type as type1,
            RT2.type as type2,
            RT3.type as type3,
            COUNT(RR.id_account) as count_Of_Review,
            count(RL.id_account) as popularity,
            avg(RR.rating) as Rating,
            RM.menu_link
            FROM restaurant_review AS RR
            RIGHT JOIN restaurant AS R ON  R.id_restaurant = RR.id_restaurant
            LEFT JOIN restaurant_menu as RM ON RM.restaurant_id = R.id_restaurant
            LEFT JOIN type as RT1 ON RT1.id_type = R.type1
            LEFT JOIN type as RT2 ON RT2.id_type = R.type2
            LEFT JOIN type as RT3 ON RT3.id_type = R.type3
            LEFT JOIN restaurant_like as RL ON R.id_restaurant = RL.id_restaurant
            
            WHERE (name regexp ? OR RT1.type regexp ? OR RT2.type regexp ? OR RT3.type regexp ?) 
            AND (
                R.type1 IN (${filter})
                OR R.type2 IN (${filter})
                OR R.type3 IN (${filter})
                ) 
            and R.distinct_location IN (${district})
    
            GROUP BY 
            R.id_restaurant
            order by ${sort}`
        }
        else {
            if (typeof (district) == Array) {
                district = district.join(',');
            }
            var sql = `
        SELECT 
        R.id_restaurant,
        R.name,
        R.img_rest,
        R.location,
        R.location_url,
        R.distinct_location as region,
        R.cost,	
        RT1.type as type1,
        RT2.type as type2,
        RT3.type as type3,
        COUNT(RR.id_account) as count_Of_Review,
        avg(RR.rating) as Rating,
        RM.menu_link
        FROM restaurant_review AS RR
        RIGHT JOIN restaurant AS R ON  R.id_restaurant = RR.id_restaurant
        LEFT JOIN restaurant_menu as RM ON RM.restaurant_id = R.id_restaurant
        LEFT JOIN type as RT1 ON RT1.id_type = R.type1
		LEFT JOIN type as RT2 ON RT2.id_type = R.type2
        LEFT JOIN type as RT3 ON RT3.id_type = R.type3
		
        WHERE (name regexp ? OR RT1.type regexp ? OR RT2.type regexp ? OR RT3.type regexp ?) 
        AND (
            R.type1 IN (${filter})
            OR R.type2 IN (${filter})
            OR R.type3 IN (${filter})
            ) 
        and R.distinct_location IN (?)

        GROUP BY 
        R.id_restaurant
		order by ${sort}`
        }

        db.query(sql, [search, search, search, search, district], callback)
    } //get all the result from the search
    //will give all restaurant if no filter is specified

    getSpecificRestaurant(id, callback) {
        var sql = `
        SELECT 
            R.id_restaurant,
            R.name,
            R.img_rest,
            R.location,
            R.location_url,
            R.distinct_location as region,
            R.cost,	
            RT1.type as type1,
            RT2.type as type2,
            RT3.type as type3,
            COUNT(RR.id_account) as count_Of_Review,
            count(RL.id_account) as popularity,
            avg(RR.rating) as Rating,
            RM.menu_link
            FROM restaurant_review AS RR
            RIGHT JOIN restaurant AS R ON  R.id_restaurant = RR.id_restaurant
            LEFT JOIN restaurant_menu as RM ON RM.restaurant_id = R.id_restaurant
            LEFT JOIN type as RT1 ON RT1.id_type = R.type1
            LEFT JOIN type as RT2 ON RT2.id_type = R.type2
            LEFT JOIN type as RT3 ON RT3.id_type = R.type3
            LEFT JOIN restaurant_like as RL ON R.id_restaurant = RL.id_restaurant
            
            WHERE R.id_restaurant=?`
        db.query(sql, [id], callback)
    }

    GetFoodImages(restaurant_id, callback) {
        var sql = `SELECT * FROM mydb.restaurant_food_img WHERE id_restaurant = ?`
        db.query(sql, [restaurant_id], callback)
    }

    getLocation(callback) {
        var sql = `SELECT 
        distinct_location as Region
        FROM restaurant`
        db.query(sql, callback)
    }

    getType(type, callback) {
        if (type == "A") {
            var sql = `SELECT *
        FROM type
        `
            db.query(sql, callback);
        }
        else {
            var sql = `SELECT *
            FROM type
            WHERE type.generalType = ?`
            db.query(sql, [type], callback);
        }
    }

    postFoodImages(restaurant_id, image, callback) {
        var sql = `INSERT INTO restaurant_food_img(id_restaurant,img_restaurant)
        VALUES(?,?)`
        db.query(sql, [restaurant_id, image], callback);
    }

    likingRestaurant(restaurant_id, account_id, callback) {
        var sql = `INSERT INTO restaurant_like(id_account,id_restaurant)
        VALUES(?,?)`
        db.query(sql, [parseInt(account_id), parseInt(restaurant_id)], callback);
    }

    // bookMarkingRestaurant(restaurant_id, account_id, callback) {
    //     var sql = `INSERT INTO restaurant_bookmark(id_account,id_restaurant)
    //     VALUES(?,?)`
    //     db.query(sql, [account_id, restaurant_id], callback)
    // }

    removeLikedRestaurant(restaurant_id, account_id, callback) {
        var sql = `DELETE FROM restaurant_like WHERE id_account = ? AND id_restaurant=?`
        db.query(sql, [account_id, restaurant_id], callback);
    }

    // removeBookMarkedRestaurant(restaurant_id, account_id, callback) {
    //     var sql = `DELETE FROM restaurant_bookmark WHERE id_account = ? AND id_restaurant=?`
    //     db.query(sql, [account_id, restaurant_id], callback);
    // }

}

module.exports = RestaurantDB;