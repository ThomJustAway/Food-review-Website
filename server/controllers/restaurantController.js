"use strict";

const RestaurantDB = require("../models/restaurantDB")

var restaurantDB = new RestaurantDB();

function getAllRestaurant(req, res) {
    restaurantDB.getAllRestaurant(function (error, result) {
        if (error) res.json(error)
        else res.json(result)
    })
}

function getSpecificRestaurant(req, res) {
    restaurantDB.getSpecificRestaurant(req.params.id,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function getLocation(req, res) {
    restaurantDB.getLocation(function (error, result) {
        if (error) res.json(error)
        else res.json(result)
    })
}

function getType(req, res) {
    restaurantDB.getType(req.params.type, function (error, result) {
        if (error) res.json(error)
        else res.json(result);
    })
}

function getSearchRestaurant(req, res) {
    restaurantDB.getSearchRestaurant(req.query.search,
        req.query.filter,
        req.query.district,
        req.query.sort,
        function (error, result) {
            if (error) res.json(error);
            else res.json(result);
        })
}

function getSearchRestaurantImproved(req, res) {
    restaurantDB.getSearchRestaurant(
        req.body.search,
        req.body.filter,
        req.body.district,
        req.body.sort,
        function (error, result) {
            if (error) res.json(error);
            else res.json(result);
        })
}

function postFoodImages(req, res) {
    restaurantDB.postFoodImages(req.params.restaurant_id,
        req.body.fileName,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function getFoodImages(req, res) {
    restaurantDB.GetFoodImages(req.params.restaurant_id,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function bookMarkingRestaurant(req, res) {
    restaurantDB.bookMarkingRestaurant(req.params.restaurant_id,
        req.params.account_id,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function likingRestaurant(req, res) {
    restaurantDB.likingRestaurant(req.params.restaurant_id,
        req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function removeLikedRestaurant(req, res) {
    restaurantDB.removeLikedRestaurant(req.params.restaurant_id,
        req.body.token,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

function removeBookMarkedRestaurant(req, res) {
    restaurantDB.removeBookMarkedRestaurant(req.params.restaurant_id,
        req.params.account_id,
        function (error, result) {
            if (error) res.json(error)
            else res.json(result)
        })
}

module.exports = {
    getAllRestaurant,
    getSearchRestaurant,
    postFoodImages,
    getFoodImages,
    bookMarkingRestaurant,
    likingRestaurant,
    removeLikedRestaurant,
    removeBookMarkedRestaurant,
    getType,
    getLocation,
    getSpecificRestaurant,
    getSearchRestaurantImproved
}