const multer = require("multer");
const path = require("path");
const {v4: uuidv4} = require("uuid");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "../backend/public/images/upload");
    },
    filename: function(req, file, cb){
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20*1024*1024
    }
});

module.exports = upload;
