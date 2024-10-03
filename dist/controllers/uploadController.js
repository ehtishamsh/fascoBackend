"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFile = UploadFile;
exports.DeleteFile = DeleteFile;
const multerUpload_1 = __importDefault(require("../utils/multerUpload"));
const fs_1 = __importDefault(require("fs"));
const path = require("path");
function UploadFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, multerUpload_1.default)(req, res, (err) => {
            if (err) {
                res.status(400).json({ message: err });
            }
            else {
                const documentFile = req.file;
                if (documentFile == undefined) {
                    res.status(400).json({ message: "No file selected!" });
                }
                else {
                    res.status(200).json({
                        message: "File uploaded!",
                        filePath: `/uploads/${documentFile.filename}`,
                    });
                }
            }
        });
    });
}
function DeleteFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { filename } = req.body;
        if (!filename) {
            return res.status(400).json({ message: "Filename is required" });
        }
        const filePath = path.join(__dirname, `../../uploads/${filename}`);
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                if (err.code === "ENOENT") {
                    return res.status(404).json({ message: "File not found" });
                }
                return res
                    .status(500)
                    .json({ message: "Error deleting file", error: err.message });
            }
            return res.json({
                message: "File deleted successfully",
                status: 200,
                data: filename,
            });
        });
    });
}
