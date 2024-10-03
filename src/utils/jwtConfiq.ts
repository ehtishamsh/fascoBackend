import crypto from "crypto";

const secretkey = crypto.randomBytes(64).toString("hex");

export default secretkey;
