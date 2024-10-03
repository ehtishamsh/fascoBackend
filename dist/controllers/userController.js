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
exports.updateUser = exports.getUsers = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const User_1 = require("../services/User");
const auth_1 = require("../utils/auth");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService_1.default.getAllUsers();
        if (!users) {
            res.status(404).send("No users found");
        }
        res.json(users);
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, firstname, lastname, email, gender, dob } = req.body;
        const user = yield (0, User_1.UpdateUser)({
            id,
            firstname,
            lastname,
            email,
            gender,
            birthday: dob,
            updatedAt: new Date(),
        });
        if (!user) {
            res.status(404).send("User not found");
        }
        const token = yield (0, auth_1.generateToken)(user);
        const removePassword = Object.assign(Object.assign({}, user), { password: undefined });
        res.json({
            status: 200,
            message: "User updated successfully",
            user: removePassword,
            token,
        });
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.updateUser = updateUser;
