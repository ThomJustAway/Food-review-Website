const MainController = require("../models/mainDB");
const maincontroller = new MainController();


function getSearchResult(req, res) {
    maincontroller.globalSearch(req.params.search,
        (err, result) => {
            if (err) res.json(err)
            else res.json(result);
        })
}

module.exports = {
    getSearchResult
}