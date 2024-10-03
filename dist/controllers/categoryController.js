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
exports.deleteCategory = void 0;
exports.getAllCategories = getAllCategories;
exports.createCategory = createCategory;
const Category_1 = require("../services/Category");
const zod_1 = require("zod");
const Product_1 = require("../services/Product");
const formSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Category Name is required")
        .max(40, "Category Name is too long"),
});
function getAllCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield (0, Category_1.All)();
            if (!categories) {
                res.status(404).send("No categories found");
            }
            res.json({
                categories,
                status: 200,
                message: "Categories fetched successfully",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    });
}
function createCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = formSchema.parse(req.body);
            const category = yield (0, Category_1.One)(name);
            if (category) {
                res.status(400).send("Category already exists");
            }
            const newCategory = yield (0, Category_1.Create)(name);
            if (!newCategory) {
                res.status(500).send("Failed to create category");
            }
            res.json({
                newCategory,
                status: 200,
                message: "Category created successfully",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    });
}
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getCate = yield (0, Product_1.getCategoryNameById)(id);
        if (!getCate) {
            return res.status(404).send("Category not found");
        }
        const deleteCategory = yield (0, Category_1.Delete)(id);
        if (!deleteCategory) {
            return res.status(404).send("Category not found");
        }
        return res.json({
            status: 200,
            message: "Category deleted successfully",
            data: deleteCategory,
        });
    }
    catch (_a) {
        console.log("error");
        return res.status(500).send("Failed to delete Category");
    }
});
exports.deleteCategory = deleteCategory;
