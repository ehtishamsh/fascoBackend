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
exports.deleteBrand = void 0;
exports.GetAll = GetAll;
exports.Create = Create;
const Brand_1 = require("../services/Brand");
const zod_1 = require("zod");
const Product_1 = require("../services/Product");
const formSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Brand Name is required")
        .max(40, "Brand Name is too long"),
});
function GetAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brands = yield (0, Brand_1.All)();
            if (!brands) {
                res.status(404).send("No brands found");
            }
            res.json({
                status: 200,
                message: "Brands fetched successfully",
                brands,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    });
}
function Create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = formSchema.parse(req.body);
            const checkifexist = yield (0, Brand_1.FindOne)(name);
            if (checkifexist) {
                res.status(400).send("Brand already exists");
            }
            const createBrand = yield (0, Brand_1.CreateBrand)(name);
            if (!createBrand) {
                res.status(500).send("Failed to create brand");
            }
            res.json({
                status: 200,
                message: "Brand created successfully",
                createBrand,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    });
}
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getBrand = yield (0, Product_1.getBrandNameById)(id);
        if (!getBrand) {
            return res.status(404).send("Brand not found");
        }
        const deleteBrand = yield (0, Brand_1.DeleteBrand)(id);
        if (!deleteBrand) {
            return res.status(404).send("Brand not found");
        }
        return res.json({
            status: 200,
            message: "Brand deleted successfully",
            data: deleteBrand,
        });
    }
    catch (_a) {
        console.log("error");
        return res.status(500).send("Failed to delete Brand");
    }
});
exports.deleteBrand = deleteBrand;
