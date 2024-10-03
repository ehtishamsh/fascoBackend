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
exports.getAll = getAll;
exports.getOne = getOne;
exports.getReviewsByUserID = getReviewsByUserID;
exports.create = create;
exports.getReviewsByUserIDandProductID = getReviewsByUserIDandProductID;
exports.getReviewsByProductID = getReviewsByProductID;
const db_1 = __importDefault(require("../utils/db"));
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.review.findMany();
    });
}
function getOne(userid, productid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.review.findMany({
            where: {
                userId: userid,
                productId: productid,
            },
        });
    });
}
function getReviewsByUserID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.review.findMany({
            where: {
                userId: id,
            },
        });
    });
}
function create(_a) {
    return __awaiter(this, arguments, void 0, function* ({ comment, rating, userid, productId, }) {
        return yield db_1.default.review.create({
            data: {
                comment: comment,
                rating,
                productId,
                userId: userid,
            },
        });
    });
}
function getReviewsByUserIDandProductID(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userid, productid, }) {
        return yield db_1.default.review.findFirst({
            where: {
                userId: userid,
                productId: productid,
            },
            select: {
                comment: true,
                rating: true,
                product: {
                    select: {
                        cover: true,
                        slug: true,
                        title: true,
                        brand: {
                            select: {
                                name: true,
                            },
                        },
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                createdAt: true,
            },
        });
    });
}
function getReviewsByProductID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.review.findMany({
            where: {
                productId: id,
            },
            select: {
                id: true,
                comment: true,
                createdAt: true,
                rating: true,
                updatedAt: true,
                productId: true,
                userId: true,
                user: {
                    select: {
                        firstname: true,
                        lastname: true,
                    },
                },
            },
        });
    });
}
