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
exports.ALLADDRESS = ALLADDRESS;
exports.CREATEADDRESS = CREATEADDRESS;
exports.UPDATEADDRESS = UPDATEADDRESS;
exports.DELETEADDRESS = DELETEADDRESS;
exports.GETSINGLEADDRESS = GETSINGLEADDRESS;
exports.GETUSERADDRESS = GETUSERADDRESS;
const Address_1 = require("../services/Address");
const db_1 = __importDefault(require("../utils/db"));
function ALLADDRESS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getAddress = yield (0, Address_1.GETALL)();
            if (!getAddress) {
                return res.status(404).json({
                    status: 404,
                    message: "No address found",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Address fetched successfully",
                address: getAddress,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    });
}
function CREATEADDRESS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstname, lastname, addressLine1, addressLine2, city, state, postalCode, country, defaultAddress, shipping, billing, userId, } = req.body;
        if (!addressLine1) {
            return res.status(400).json({
                status: 400,
                message: "Address is required",
            });
        }
        try {
            const createAddress = yield (0, Address_1.CREATE)({
                firstname,
                lastname,
                addressLine1,
                addressLine2,
                city,
                state,
                postalCode,
                country,
                default: defaultAddress,
                shipping,
                billing,
                userId,
            });
            if (!createAddress) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Address created successfully",
                address: createAddress,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    });
}
function UPDATEADDRESS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, firstname, lastname, addressLine1, addressLine2, city, state, postalCode, country, defaultAddress, shipping, billing, userId, } = req.body;
        if (!addressLine1) {
            return res.status(400).json({
                status: 400,
                message: "Address is required",
            });
        }
        try {
            const checkifexist = yield (0, Address_1.GETBYID)(id);
            if (!checkifexist) {
                return res.status(404).json({
                    status: 404,
                    message: "Address not found",
                });
            }
            const updatedAddress = yield (0, Address_1.UPDATE)(id, {
                firstname,
                lastname,
                addressLine1,
                addressLine2,
                city,
                state,
                billing,
                country,
                default: defaultAddress,
                postalCode: postalCode,
                shipping,
                userId,
            });
            if (!updatedAddress) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Address updated successfully",
                address: updatedAddress,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    });
}
function DELETEADDRESS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "Id is required",
            });
        }
        try {
            const deleteAddress = yield (0, Address_1.DELETE)(id);
            if (!deleteAddress) {
                return res.status(404).json({
                    status: 404,
                    message: "Address not found",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Address deleted successfully",
                address: deleteAddress,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    });
}
function GETSINGLEADDRESS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "Id is required",
            });
        }
        try {
            const getAddress = yield (0, Address_1.GETBYID)(id);
            if (!getAddress) {
                return res.status(404).json({
                    status: 404,
                    message: "Address not found",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Address fetched successfully",
                address: getAddress,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    });
}
function GETUSERADDRESS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { id } = req.body;
            const getAddress = yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.address) === null || _a === void 0 ? void 0 : _a.findMany({
                where: {
                    userId: id,
                },
            }));
            if (!getAddress) {
                return res.status(404).json({
                    status: 404,
                    message: "Address not found",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Address fetched successfully",
                address: getAddress,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    });
}
