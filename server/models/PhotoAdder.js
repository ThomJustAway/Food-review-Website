const multer = require("multer");
const path = require("path");


const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../client/src/RestaurantFood"))
    },
    filename: (req, file, cb) => {
        const time = Date.now();
        req.body.fileName = time + path.extname(file.originalname)
        cb(null, time + path.extname(file.originalname))
    }
})

const UploadIAccountmage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../client/src/accountImages"))
    },
    filename: (req, file, cb) => {
        const time = Date.now();
        req.body.fileName = time + path.extname(file.originalname)
        cb(null, time + path.extname(file.originalname))
    }
});

const upload = multer({ storage: Storage });
const uploadimage = upload.single("image");

const uploadAccount = multer({ storage: UploadIAccountmage })
const uploadAccountImage = uploadAccount.single("image");
module.exports = {
    uploadimage,
    uploadAccountImage
}