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
exports.getDashboardData = getDashboardData;
const db_1 = __importDefault(require("../utils/db"));
function getDashboardData() {
    return __awaiter(this, void 0, void 0, function* () {
        const totalUsers = yield db_1.default.user.count();
        const totalProducts = yield db_1.default.product.count();
        const totalOrders = yield db_1.default.order.count();
        const usersByMonth = yield db_1.default.user.groupBy({
            by: ["createdAt"],
            _count: {
                id: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const ordersByMonth = yield db_1.default.order.groupBy({
            by: ["createdAt"],
            _count: {
                id: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const pendingOrders = yield db_1.default.order.count({
            where: {
                orderStatus: "PENDING",
            },
        });
        const completedOrders = yield db_1.default.order.count({
            where: {
                orderStatus: "COMPLETED",
            },
        });
        const cancelledOrders = yield db_1.default.order.count({
            where: {
                orderStatus: "CANCELLED",
            },
        });
        const totalReviews = yield db_1.default.review.count();
        const totalSales = yield db_1.default.order.aggregate({ _sum: { amount: true } });
        const salesByMonth = yield db_1.default.order.groupBy({
            by: ["createdAt"],
            _sum: {
                amount: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return {
            totalUsers: {
                all: totalUsers,
                monthly: usersByMonth,
            },
            totalProducts,
            totalOrders: {
                all: totalOrders,
                monthly: ordersByMonth,
            },
            totalReviews,
            pendingOrders,
            completedOrders,
            cancelledOrders,
            totalSales: totalSales._sum.amount || 0,
            salesByMonth,
        };
    });
}
