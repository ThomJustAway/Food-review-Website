"use strict";

const ReviewDB = require("../models/reviewDB")

var reviewDB = new ReviewDB

function getAllReviewById(req, res) {
    reviewDB.getAllReviewById(req.params.id,
        req.query.limit,
        req.query.sort,
        req.query.filter,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function getReviewId(req, res) {
    reviewDB.getReviewId(req.params.restaurantId, req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function updateReview(req, res) {
    let time = new Date();
    reviewDB.updateReview(req.params.id,
        req.body.text,
        time.toString(),
        req.body.rating,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        }
    )
}

function createReview(req, res) {
    let time = new Date();
    reviewDB.createReview(req.body.token,
        req.params.restaurant_id,
        req.body.text,
        time.toString(),
        req.body.rating,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function deleteVote(req, res) {
    reviewDB.deleteVote(req.params.id_restaurant_review,
        req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function insertVOTE(req, res) {
    reviewDB.insertVOTE(req.params.id_restaurant_review,
        req.body.token,
        req.params.vote,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function getVote(req, res) {
    reviewDB.getVote(req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function deleteReview(req, res) {
    reviewDB.deleteReview(req.params.id_restaurant_review,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

module.exports = {
    getAllReviewById,
    updateReview,
    createReview,
    deleteVote,
    insertVOTE,
    deleteReview,
    getReviewId,
    getVote
}