const express = require('express');



const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
    origin: "*"
}))



var restaurantController = require("./controllers/restaurantController")
var accountController = require("./controllers/accountController")
var reviewController = require("./controllers/review.controller")
var textController = require("./controllers/textingController");
var mainController = require("./controllers/mainController");
const { application } = require('express');
const TextingDB = require('./models/textingDB');
const textingDb = new TextingDB();


const upload = require("./models/PhotoAdder")

//Main api
app.route('/main/search/:search').get(mainController.getSearchResult);

//restaurant api
app.route('/Restaurant/getSpecific/:id').get(restaurantController.getSpecificRestaurant);

app.route('/Restaurant/getType/:type').get(restaurantController.getType);
app.route('/Restaurant/getLocation').get(restaurantController.getLocation);
app.route('/Restaurant/getAll').get(restaurantController.getAllRestaurant);
app.route('/Restaurant/getSearch').get(restaurantController.getSearchRestaurant);
app.route('/Restaurant/Improve/Search').post(restaurantController.getSearchRestaurantImproved);


app.route('/Restaurant/postFoodImages/:restaurant_id')
    .post(
        accountController.authenticateToken,
        upload.uploadimage,
        restaurantController.postFoodImages);//restaurantController.postFoodImages

app.route('/Restaurant/getFoodImages/:restaurant_id')
    .get(restaurantController.getFoodImages);
// app.route('/Restaurant/bookmark_restaurant/:restaurant_id/:account_id').post(restaurantController.bookMarkingRestaurant);
app.route('/Restaurant/like_restaurant/:restaurant_id')
    .post(accountController.authenticateToken
        , restaurantController.likingRestaurant);
app.route('/Restaurant/removeLike_restaurant/:restaurant_id')
    .delete(accountController.authenticateToken
        , restaurantController.removeLikedRestaurant);
// app.route('/Restaurant/removeBookmark_restaurant/:restaurant_id/:account_id').delete(restaurantController.removeBookMarkedRestaurant);


//account api
app.route('/Account')
    .get(accountController.authenticateToken,
        accountController.getAccount); //get specific account

app.route('/Account/Getid')
    .get(accountController.authenticateToken,
        function (req, res) {
            res.json(req.body.token);
        }
    )

app.route('/Account/Preview/:id')
    .get(accountController.getOtherPeopleAccount);//get other people account

// app.route('/Account/getBookmarkRestaurant/:account_id').get(accountController.getBookMarkedRestaurant);
app.route('/Account/getLikedRestaurant')
    .get(accountController.authenticateToken,
        accountController.getLikeRestaurant); // get like restaurant in the account

app.route('/Account/get/allEmail')
    .get(accountController.getAllEmail);

app.route('/Account/email/:email')
    .get(accountController.getAccountByEmail);//legacy

app.route('/Account/update')
    .put(accountController.authenticateToken,
        accountController.updateAccount)

app.route('/Account/updateProfile')
    .put(
        upload.uploadAccountImage,
        accountController.authenticateToken,
        accountController.updateProfile
    )


app.route('/Account/create')
    .post(accountController.createAccount);

app.route('/Account/delete')
    .delete(accountController.authenticateToken,
        accountController.deleteAccount);//works

app.route('/Account/get/follower')
    .get(accountController.authenticateToken,
        accountController.getFollower);//works //legacy

app.route('/Account/get/blockFollower')
    .get(accountController.authenticateToken,
        accountController.getBlockFollower);//work //legacy

app.route('/Account/get/Following')
    .get(accountController.authenticateToken,
        accountController.getFollowing);//work //legacy

app.route('/Account/followAccount/:follower_account')
    .post(accountController.authenticateToken,
        accountController.followAccount);//work 

app.route('/Account/blockAccount/:block_account')
    .post(accountController.authenticateToken,
        accountController.blockaccount);//work

app.route('/Account/unfollowAccount/:unfollower_account')
    .delete(accountController.authenticateToken
        , accountController.unfollowAccount);//work

app.route('/Account/unblockAccount/:block_account')
    .delete(accountController.authenticateToken
        , accountController.unblockAccount);//work

app.route("/Account/findAccount")
    .post(accountController.authenticateToken,
        accountController.getSearch)

app.route('/Account/reset/Password')
    .put(accountController.authenticateToken,
        accountController.resetPassword)

//review Api
app.route('/Review/Get/:id').get(reviewController.getAllReviewById);
app.route('/Review/Update/:id').put(reviewController.updateReview);
app.route('/Review/Create/:restaurant_id')
    .post(accountController.authenticateToken
        , reviewController.createReview);//works

app.route('/Review/vote/get')
    .get(accountController.authenticateToken, reviewController.getVote);

app.route('/Review/DeleteVote/:id_restaurant_review')//legacy
    .delete(accountController.authenticateToken
        , reviewController.deleteVote);// this is to delete the vote entirely
app.route('/Review/InsertVote/:vote/:id_restaurant_review')
    .post(accountController.authenticateToken
        , reviewController.insertVOTE); //create the negative or postitve vote
app.route('/Review/Delete/:id_restaurant_review')
    .delete(reviewController.deleteReview);
app.route('/ReviewId/Get/:restaurantId')
    .get(accountController.authenticateToken
        , reviewController.getReviewId)

//texting api
app.route('/Text/getText/:other_account')
    .get(accountController.authenticateToken
        , textController.getText)
app.route('/Text/createText/:host_account/:other_account')
    .post(accountController.authenticateToken,
        textController.createText);
app.route('/Text/deleteText/:id_text')
    .delete(accountController.authenticateToken
        , textController.deleteText);
app.route('/Text/checkIfBlock/:account/:block_account')
    .get(textController.checkIfBlock)

//--------------- for real time server rendering------
const io = require('socket.io')(4000, {
    cors: { origin: "http://localhost:3000" }
});

let user = [];

io.on('connection', (socket) => {
    console.log('Client connected');
    // Listen for database updates and broadcast to all connected clients

    function addMessage(socket1, socket2, otherId, text) {
        let hostsocket = socket1;
        let otherSocket = socket2;

        textingDb.createText(hostsocket.id
            , otherId
            , text
            , function () {
                textingDb.getText(hostsocket.id
                    , otherId,
                    function (_, result2) {
                        console.log(otherSocket);
                        if (otherSocket) {
                            io.to(otherSocket.socketId).emit('Recieve Message', result2)
                            io.to(hostsocket.socketId).emit('Recieve Message', result2)
                        }
                        else {
                            io.to(hostsocket.socketId).emit('Recieve Message', result2)
                        }

                    }
                )

            })
    }

    function deleteMessage(textId, hostId, otherId) {
        textingDb.deleteText(textId, () => {
            textingDb.getText(hostId, otherId,
                function (error, result) {
                    io.emit('Recieve Message', result)
                })
        })
    }

    socket.on('connect user', (data) => {
        const id = accountController.sendingVerification(data.token);
        console.log("user data")
        console.log(data);
        user.push({
            id: id,
            socketId: data.socketId,
            token: data.token
        })
        console.log(user)
    })

    socket.on('disconnect user', (socketId) => {
        user = user.filter(activeUser => activeUser.socketId !== socketId)
        console.log(user)
    })

    socket.on("delete Message", (data) => {
        const tokenid = accountController
            .sendingVerification(data.token);
        deleteMessage(data.messageId, tokenid, data.other_account)
    })

    socket.on('send Message', (data) => {
        const text = data.Message;
        const token = data.token;
        const otherId = data.other_account;
        const userId = accountController.sendingVerification(token)
        console.log('This is the users')
        console.log(user)
        let userSocket;
        let otherSocket;
        user.forEach(socket => {
            if (socket.id == otherId) {
                otherSocket = socket
            }

            if (socket.id == userId) {

                userSocket = socket
            }
        });
        console.log("this are the other sockets \n\n")
        console.log(userSocket);
        console.log(otherSocket);
        addMessage(userSocket, otherSocket, otherId, text)

        // socket.broadcast.emit('Recieve Message', data);
        //will be sending the mysql new data back to the client
    });

    // Clean up when a client disconnects
    socket.on('disconnect', (socketId) => {
        console.log('Client disconnected');
    });
});
//-----------------------------------

//special api
app.route('/sendVerification/:email/:pin').get(accountController.sendPin);
app.route('/sendForgetPassword/:email').get(accountController.sendForgetPassword);

app.listen(5000, () => { console.log("Server started on port 5000") });
console.log("the server is running on http://127.0.0.1:5000")