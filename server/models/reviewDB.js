"use strict";

var db = require("../db-connections");

class reviewDB {
    getAllReviewById(id_restaurant, limit, sort, filter, callback) {
        if (limit == undefined && filter == undefined) {
            var sql = `SELECT 
                RR.id_restaurant_review,
                RR.id_account,
                A.username,
                A.profile,
                RR.id_restaurant,
                RR.text,
                timeDifference(RR.date) as date,
                RR.rating as rating,
                SUM(RRV.upvote) as vote
            FROM restaurant_review as RR
                left JOIN restaurant_review_vote as rrv ON  RR.id_restaurant_review= RRV.id_restaurant_review
                left JOIN account as A on A.id_account = RR.id_account
            WHERE RR.id_restaurant =?
                GROUP BY 
            RR.id_restaurant_review
            ${sort}`
        }
        else if (filter != undefined) {
            var sql = `
            SELECT 
            RR.id_restaurant_review,
            RR.id_account,
            A.username,
            A.profile,
            RR.id_restaurant,
            RR.text,
            RR.rating as rating,
            timeDifference(RR.date) as date,
            SUM(RRV.upvote) as vote
        FROM restaurant_review as RR
            left JOIN restaurant_review_vote as rrv ON  RR.id_restaurant_review= RRV.id_restaurant_review
            left JOIN account as A on A.id_account = RR.id_account
        WHERE RR.id_restaurant =? ${filter}
            GROUP BY 
        RR.id_restaurant_review
        ${sort}`
        }
        else {
            var sql = `SELECT 
        RR.id_restaurant_review,
        RR.id_account,
        A.username,
        A.profile,
        RR.id_restaurant,
        RR.text,
        timeDifference(RR.date) as date,
        SUM(RRV.upvote) as vote
            FROM restaurant_review as RR
                left JOIN restaurant_review_vote as rrv ON  RR.id_restaurant_review= RRV.id_restaurant_review
                left JOIN account as A on A.id_account = RR.id_account
            WHERE RR.id_restaurant =?
            GROUP BY 
            RR.id_restaurant_review
            ${sort}
            ${limit}`
        }
        db.query(sql, [parseInt(id_restaurant)], callback)
    } //get review from the restaurant

    getReviewId(id_restaurant, id_user, callback) {
        var sql = `select id_restaurant_review 
        FROM restaurant_review
        WHERE id_account=? and id_restaurant=?`
        db.query(sql, [id_user, id_restaurant], callback)
    }

    updateReview(id_review, text, date, rating, callback) {
        var sql = `UPDATE restaurant_review 
                    SET text = ?,
                        date = NOW(),
                        rating = ?
                    WHERE id_restaurant_review = ?`
        db.query(sql, [text, rating, id_review], callback)
    } //updating the review

    createReview(id_account, id_restaurant, text, date, rating, callback) {
        var sql = `INSERT INTO restaurant_review (id_account,id_restaurant,text,date,rating)
        VALUES(?,?,?,now(),?)`
        db.query(sql, [id_account, id_restaurant, text, rating], callback)
    } //create review

    deleteVote(id_restaurant_review, id_account, callback) {
        var sql = `DELETE FROM restaurant_review_vote 
        WHERE id_restaurant_review=? AND id_account=?;`
        db.query(sql, [id_restaurant_review, id_account], callback);
    }

    insertVOTE(id_restaurant_review, id_account, vote, callback) {
        let review = parseInt(id_restaurant_review);
        id_account = parseInt(id_account);
        vote = parseInt(vote);
        var sql = `
        call vote(?,?,?);`
        db.query(sql, [vote, id_account, review], callback)
    } //inserting vote for the review

    getVote(id_account, callback) {
        var sql = `SELECT * FROM mydb.restaurant_review_vote
        where id_account = ?`
        db.query(sql, [id_account], callback)
    }

    deleteReview(id_restaurant_review, callback) {
        var sql = `DELETE FROM restaurant_review 
        WHERE id_restaurant_review=? `
        db.query(sql, [id_restaurant_review], callback)
    }
}

module.exports = reviewDB;