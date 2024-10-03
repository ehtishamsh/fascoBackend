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
exports.All = All;
exports.FindOne = FindOne;
exports.CreateBrand = CreateBrand;
exports.DeleteBrand = DeleteBrand;
const db_1 = __importDefault(require("../utils/db"));
function All() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.brand) === null || _a === void 0 ? void 0 : _a.findMany());
    });
}
function FindOne(name) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.brand) === null || _a === void 0 ? void 0 : _a.findFirst({ where: { name } }));
    });
}
function CreateBrand(name) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.brand) === null || _a === void 0 ? void 0 : _a.create({ data: { name } }));
    });
}
function DeleteBrand(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return yield ((_a = db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.brand) === null || _a === void 0 ? void 0 : _a.delete({ where: { id } }));
    });
}
