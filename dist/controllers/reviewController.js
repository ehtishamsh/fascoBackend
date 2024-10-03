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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderReview = orderReview;
exports.addReview = addReview;
exports.getReviewsByOrderID = getReviewsByOrderID;
exports.getReviewByProductSlug = getReviewByProductSlug;
const User_1 = require("../services/User");
const Order_1 = require("../services/Order");
const Product_1 = require("../services/Product");
const Review_1 = require("../services/Review");
function orderReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { uid } = req.params;
        try {
            const checkUser = yield (0, User_1.findUserByID)(uid);
            if (!checkUser) {
                return res.status(404).json({
                    status: 404,
                    message: "User not found",
                });
            }
            const orders = yield (0, Order_1.getOrderByUserID)(uid);
            if (!orders) {
                return res.status(404).json({
                    status: 404,
                    message: "Product not found",
                });
            }
            const getReviews = yield (0, Review_1.getReviewsByUserID)(uid);
            if (!getReviews) {
                return res.status(404).json({
                    status: 404,
                    message: "Product not found",
                });
            }
            const checkIfComplete = orders.filter((order) => order.orderStatus === "COMPLETED");
            if (checkIfComplete.length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: "No orders or reviews found for this user",
                });
            }
            const checkIfReviewed = checkIfComplete.map((order) => {
                var _a;
                // Map through each item in the order
                const updatedItems = (_a = order.items) === null || _a === void 0 ? void 0 : _a.map((item) => {
                    // Check if there is a review for this product
                    const isReviewed = getReviews.some((review) => review.productId === item.product.id);
                    // Return the item with the 'reviewed' property set accordingly
                    return Object.assign(Object.assign({}, item), { reviewed: isReviewed });
                });
                // Return the updated order with the modified items
                return Object.assign(Object.assign({}, order), { items: updatedItems });
            });
            if (checkIfReviewed.length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: "No orders or reviews found for this user",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Reviews fetched successfully",
                orders: checkIfReviewed,
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    });
}
function addReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { ratings, comment, userid, } = req.body;
            const checkuser = yield (0, User_1.findUserByID)(userid);
            if (!checkuser) {
                return res.status(404).json({
                    status: 404,
                    message: "User not found",
                });
            }
            const getProductID = Object.keys(ratings);
            const checkproducts = yield Promise.all(getProductID.map((id) => __awaiter(this, void 0, void 0, function* () {
                const product = yield (0, Product_1.findProductById)(id);
                if (!product) {
                    return res.status(404).json({
                        status: 404,
                        message: "Product not found",
                    });
                }
                return product;
            })));
            if (checkproducts.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Product not found",
                });
            }
            const createReviews = yield Promise.all(getProductID.map((id, index) => __awaiter(this, void 0, void 0, function* () {
                if (id === Object.keys(ratings)[index] &&
                    id === Object.keys(comment)[index]) {
                    const review = ratings[id];
                    const comments = comment[id];
                    const createReview = yield (0, Review_1.create)({
                        userid,
                        productId: id,
                        comment: comments,
                        rating: review,
                    });
                    if (!createReview) {
                        return res.status(400).json({
                            status: 400,
                            message: "Bad request",
                        });
                    }
                    return createReview;
                }
            })));
            if (createReviews.length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: "Bad request",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Review created successfully",
                reviews: createReviews,
            });
        }
        catch (error) {
            res.status(400).send("Bad request");
        }
    });
}
function getReviewsByOrderID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { id } = req.params;
        try {
            const order = yield (0, Order_1.getOrderByOrderNumber)(Number(id));
            if (!order) {
                return res.status(404).json({ message: "Order not found", status: 404 });
            }
            const productIDs = (_a = order.items) === null || _a === void 0 ? void 0 : _a.map((item) => item.product.id);
            const getReviews = yield Promise.all(productIDs.map((productId) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const userEmail = order.user.email;
                const getUser = yield (0, User_1.findUserByEmail)(userEmail);
                if (!getUser) {
                    return res
                        .status(404)
                        .json({ message: "User not found", status: 404 });
                }
                const product = yield (0, Product_1.findProductById)(productId);
                if (!product) {
                    return res
                        .status(404)
                        .json({ message: "Product not found", status: 404 });
                }
                const review = yield (0, Review_1.getReviewsByUserIDandProductID)({
                    productid: productId,
                    userid: getUser.id,
                });
                return review
                    ? Object.assign(Object.assign({}, review), { color: (_b = (_a = order.items) === null || _a === void 0 ? void 0 : _a.find((item) => item.product.id === productId)) === null || _b === void 0 ? void 0 : _b.color, variant: (_d = (_c = order.items) === null || _c === void 0 ? void 0 : _c.find((item) => item.product.id === productId)) === null || _d === void 0 ? void 0 : _d.variant }) : null;
            })));
            const reviewsWithData = getReviews.filter((review) => review !== null);
            if (reviewsWithData.length > 0) {
                return res.status(200).json({
                    message: "Reviews fetched successfully",
                    status: 200,
                    reviews: reviewsWithData,
                });
            }
            return res
                .status(200)
                .json({ data: order, status: 200, message: "Order found" });
        }
        catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ message: "Error fetching order items", status: 400 });
        }
    });
}
function getReviewByProductSlug(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const product = yield (0, Product_1.findProductBySlug)(id);
            if (!product) {
                return res
                    .status(404)
                    .json({ message: "Product not found", status: 404 });
            }
            const getReviews = yield (0, Review_1.getReviewsByProductID)(product.id);
            if (!getReviews) {
                return res
                    .status(404)
                    .json({ message: "Reviews not found", status: 404 });
            }
            return res.status(200).json({
                message: "Reviews fetched successfully",
                status: 200,
                reviews: getReviews,
            });
        }
        catch (_a) {
            res.status(400).send("Bad request");
        }
    });
}
