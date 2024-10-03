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
exports.GETALL = GETALL;
exports.GETBYID = GETBYID;
exports.GETBYUSERID = GETBYUSERID;
exports.CREATE = CREATE;
exports.UPDATE = UPDATE;
exports.DELETE = DELETE;
const db_1 = __importDefault(require("../utils/db"));
function GETALL() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const data = yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.address) === null || _a === void 0 ? void 0 : _a.findMany());
        return data;
    });
}
function GETBYID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const data = yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.address) === null || _a === void 0 ? void 0 : _a.findFirst({
            where: {
                id: id,
            },
        }));
        return data;
    });
}
function GETBYUSERID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const data = yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.address) === null || _a === void 0 ? void 0 : _a.findMany({
            where: {
                userId: id,
            },
        }));
        return data;
    });
}
function CREATE(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.address.create({ data });
    });
}
function UPDATE(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.address.update({ where: { id }, data });
    });
}
function DELETE(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.address.delete({ where: { id } });
    });
}
