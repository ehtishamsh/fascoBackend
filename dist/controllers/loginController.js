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
exports.login = login;
const zod_1 = require("zod");
const User_1 = require("../services/User");
const auth_1 = require("../utils/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const FormSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email address is required" })
        .email({ message: "Please enter a valid email address" }),
    password: zod_1.z
        .string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" }),
});
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = FormSchema.parse(req.body);
            const findUser = (yield (0, User_1.findUniqueUserById)(email));
            if (!findUser) {
                res.status(404).send("User not found");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, findUser.password);
            if (!isPasswordValid) {
                res.status(400).send("Password is incorrect");
            }
            const token = (0, auth_1.generateToken)(findUser);
            const removePassword = Object.assign(Object.assign({}, findUser), { password: undefined });
            return res
                .status(200)
                .json({ token, user: removePassword, message: "Login successful" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
}
