const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
    origin: "*"
}))

var authController = require("./controllers/authController")

app.route('/login').post(authController.login)
app.route('/refresh/access/token').post(authController.refreshAccessToken);
app.route('/logOut').post(authController.logOut);

app.listen(7000, () => { console.log("Auth Server started on port 7000") });
console.log("the server is running on http://127.0.0.1:7000")