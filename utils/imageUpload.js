const multer = require('multer');
const path = require('path')
const fs = require('fs-extra')
const storageavatar = multer.diskStorage({
    destination: function (req, file, cb) {
        const userID = req.query.userId
        const uploadPath = `./public/avatar/${userID}/`
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
});

const storagedriverlicensee = multer.diskStorage({
    destination: function (req, file, cb) {
        const userID = req.query.userId
        const uploadPath = `./public/driver/${userID}/license/`
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
});

const storagedriveruberlyft = multer.diskStorage({
    destination: function (req, file, cb) {
        const userID = req.query.userId
        const uploadPath = `./public/driver/${userID}/uberlyft/`
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
});

const storageartistmedia = multer.diskStorage({
    destination: function (req, file, cb) {
        const userID = req.query.userId
        const uploadPath = `./public/artist/${userID}/media`
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
});

const storageartistcover = multer.diskStorage({
    destination: function (req, file, cb) {

        const userID = req.query.userId
        const uploadPath = `./public/artist/${userID}/cover`
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    
    filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        return cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
}
const fileFilterartistlibrary = (req, file, cb) => {
    const filetypes = /mp3|wav|mpeg/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
        return cb(null, true);
    }
      cb (new Error('Only mp3 and wav files are allowed'))
}




 const uploadavatar = multer({storage: storageavatar, fileFilter : fileFilter,limits: { fileSize: 10 * 1024 * 1024,    fieldSize: 10 * 1024 * 1024, }});
 const uploaddriverlicense = multer({storage: storagedriverlicensee, fileFilter : fileFilter,limits: { fileSize: 10 * 1024 * 1024,    fieldSize: 10 * 1024 * 1024, },});
 const uploaddriveruberlyft = multer({storage: storagedriveruberlyft, fileFilter : fileFilter,limits: { fileSize: 10 * 1024 * 1024,    fieldSize: 10 * 1024 * 1024, },});
 const uploadartistmedia = multer({storage: storageartistmedia, fileFilter : fileFilterartistlibrary,limits: { fileSize: 10 * 1024 * 1024,    fieldSize: 10 * 1024 * 1024, },});
 const uploadartistcover = multer({storage: storageartistcover, fileFilter : fileFilter,limits: { fileSize: 10 * 1024 * 1024,    fieldSize: 10 * 1024 * 1024, },});

 const errorHandler = (err, req, res, next) => {
    res.status(400).json({ message: err.message }); 
};


module.exports ={
    uploadavatar,
    uploaddriverlicense,
    uploaddriveruberlyft,
    uploadartistmedia,
    uploadartistcover,
    errorHandler
}


