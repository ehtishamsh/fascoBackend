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
exports.checkExistingOrder = checkExistingOrder;
exports.checkOrderItems = checkOrderItems;
exports.createOrder = createOrder;
exports.refundStatus = refundStatus;
exports.createOrderItems = createOrderItems;
exports.getAllOrders = getAllOrders;
exports.getOrderById = getOrderById;
exports.getOrderByOrderNumber = getOrderByOrderNumber;
exports.getOrderItemsByOrderId = getOrderItemsByOrderId;
exports.getOrderByUserID = getOrderByUserID;
exports.updateOrderStatus = updateOrderStatus;
exports.allOrders = allOrders;
exports.getOrderByProductId = getOrderByProductId;
const db_1 = __importDefault(require("../utils/db"));
function checkExistingOrder(paymentIntentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.findFirst({
            where: {
                paymentIntentId,
            },
        });
    });
}
function checkOrderItems(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.orderItem.findMany({
            where: {
                orderId,
            },
        });
    });
}
function createOrder(data, total, addressId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.create({
            data: {
                orderNumber: Math.floor(Math.random() * 100000),
                addressId: addressId,
                userId: userId,
                amount: total,
                orderStatus: "PENDING",
                status: ["Your Order has been placed."],
                currency: "usd",
                paymentIntentId: data.payment_intentId,
                paymentStatus: data.payment_status === "paid" ? "PAID" : "PENDING",
            },
        });
    });
}
function refundStatus(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.update({
            where: {
                id: orderId,
            },
            data: {
                updatedAt: new Date(),
                paymentStatus: "REFUNDED",
            },
        });
    });
}
function createOrderItems(orderId, products) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            return yield db_1.default.orderItem.create({
                data: {
                    orderId,
                    productId: product.id,
                    variantId: (_a = product.selectedVariant) === null || _a === void 0 ? void 0 : _a.id,
                    colorID: (_b = product.selectedColor) === null || _b === void 0 ? void 0 : _b.id,
                    quantity: product.quantity || 1,
                    price: Number(product.discounted) > 0
                        ? Number(product.discounted)
                        : Number(product.price),
                    total: ((Number(product.discounted) > 0
                        ? Number(product.discounted)
                        : Number(product.price)) +
                        Number((_c = product.selectedVariant) === null || _c === void 0 ? void 0 : _c.price)) *
                        Number(product.quantity),
                },
            });
        })));
    });
}
function getAllOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.findMany();
    });
}
function getOrderById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.findUnique({
            where: {
                id,
            },
        });
    });
}
function getOrderByOrderNumber(orderNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.findUnique({
            where: {
                orderNumber,
            },
            select: {
                id: true,
                updatedAt: true,
                address: true,
                amount: true,
                currency: true,
                orderNumber: true,
                status: true,
                paymentStatus: true,
                paymentIntentId: true,
                user: {
                    select: {
                        email: true,
                        firstname: true,
                        lastname: true,
                    },
                },
                createdAt: true,
                orderStatus: true,
                items: {
                    select: {
                        id: true,
                        price: true,
                        total: true,
                        variant: {
                            select: {
                                price: true,
                                variant: true,
                            },
                        },
                        color: {
                            select: {
                                color: true,
                            },
                        },
                        quantity: true,
                        product: {
                            select: {
                                title: true,
                                category: {
                                    select: {
                                        name: true,
                                    },
                                },
                                createdAt: true,
                                brand: {
                                    select: {
                                        name: true,
                                    },
                                },
                                id: true,
                                price: true,
                                slug: true,
                                updatedAt: true,
                                cover: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });
    });
}
function getOrderItemsByOrderId(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.orderItem.findMany({
            where: {
                orderId,
            },
        });
    });
}
function getOrderByUserID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.findMany({
            where: {
                userId: id,
            },
            select: {
                id: true,
                address: true,
                paymentIntentId: true,
                amount: true,
                currency: true,
                orderNumber: true,
                status: true,
                paymentStatus: true,
                createdAt: true,
                orderStatus: true,
                items: {
                    select: {
                        id: true,
                        price: true,
                        total: true,
                        variant: {
                            select: {
                                price: true,
                                variant: true,
                            },
                        },
                        color: {
                            select: {
                                color: true,
                            },
                        },
                        quantity: true,
                        product: true,
                    },
                },
            },
        });
    });
}
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["COMPLETED"] = "COMPLETED";
})(OrderStatus || (OrderStatus = {}));
function updateOrderStatus(orderNumber, orderStatus, status) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.update({
            where: {
                orderNumber: parseInt(orderNumber),
            },
            data: {
                updatedAt: new Date(),
                orderStatus: {
                    set: orderStatus,
                },
                status,
            },
        });
    });
}
function allOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.order.findMany({
            select: {
                id: true,
                address: true,
                amount: true,
                currency: true,
                orderNumber: true,
                status: true,
                user: {
                    select: {
                        id: true,
                    },
                },
                paymentStatus: true,
                paymentIntentId: true,
                createdAt: true,
                orderStatus: true,
                items: {
                    select: {
                        id: true,
                        price: true,
                        total: true,
                        variant: {
                            select: {
                                price: true,
                                variant: true,
                            },
                        },
                        color: {
                            select: {
                                color: true,
                            },
                        },
                        quantity: true,
                        product: {
                            select: {
                                discounted: true,
                                title: true,
                                category: {
                                    select: {
                                        name: true,
                                    },
                                },
                                createdAt: true,
                                brand: {
                                    select: {
                                        name: true,
                                    },
                                },
                                id: true,
                                price: true,
                                slug: true,
                                updatedAt: true,
                                cover: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });
    });
}
function getOrderByProductId(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.orderItem.findMany({
            where: {
                productId,
            },
            select: {
                id: true,
                price: true,
                total: true,
                variant: {
                    select: {
                        price: true,
                        variant: true,
                    },
                },
                color: {
                    select: {
                        color: true,
                    },
                },
                product: true,
            },
        });
    });
}
