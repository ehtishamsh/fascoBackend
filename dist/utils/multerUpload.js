"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single("image");
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb("Error: Images Only!");
    }
}
exports.default = upload;
