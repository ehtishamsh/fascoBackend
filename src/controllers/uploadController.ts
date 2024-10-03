import { Request, Response } from "express";
import upload from "../utils/multerUpload";
import fs from "fs";
const path = require("path");
interface MyRequest extends Request {
  file: any;
}
export async function UploadFile(req: Request, res: Response) {
  upload(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ message: err });
    } else {
      const documentFile = (req as MyRequest).file;
      if (documentFile == undefined) {
        res.status(400).json({ message: "No file selected!" });
      } else {
        res.status(200).json({
          message: "File uploaded!",
          filePath: `/uploads/${documentFile.filename}`,
        });
      }
    }
  });
}

export async function DeleteFile(req: Request, res: Response) {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ message: "Filename is required" });
  }
  const filePath = path.join(__dirname, `../../uploads/${filename}`);
  fs.unlink(filePath, (err) => {
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
}
