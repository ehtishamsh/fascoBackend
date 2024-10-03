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
exports.getAllProducts = getAllProducts;
exports.getAllVariants = getAllVariants;
exports.getAllColors = getAllColors;
exports.getCategoryNameById = getCategoryNameById;
exports.getBrandNameById = getBrandNameById;
exports.findProductByTitle = findProductByTitle;
exports.createProduct = createProduct;
exports.findVariantByNameAndProductId = findVariantByNameAndProductId;
exports.createVariant = createVariant;
exports.findColorByNameAndProductId = findColorByNameAndProductId;
exports.createColor = createColor;
exports.findProductBySlug = findProductBySlug;
exports.findProductById = findProductById;
exports.updateProduct = updateProduct;
exports.getVariantbyId = getVariantbyId;
exports.getColorbyId = getColorbyId;
exports.deleteProduct = deleteProduct;
exports.updateVariant = updateVariant;
exports.updateColor = updateColor;
exports.deleteVariant = deleteVariant;
exports.deleteColor = deleteColor;
exports.getVariantbyProductId = getVariantbyProductId;
exports.getColorbyProductId = getColorbyProductId;
exports.getProductsByCategory = getProductsByCategory;
exports.getProductFilterData = getProductFilterData;
exports.getSearchedProducts = getSearchedProducts;
exports.Delete = Delete;
const db_1 = __importDefault(require("../utils/db"));
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.findMany();
    });
}
function getAllVariants() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.variant.findMany();
    });
}
function getAllColors() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.color.findMany();
    });
}
function getCategoryNameById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.category.findUnique({
            where: { id },
        });
    });
}
function getBrandNameById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.brand.findUnique({
            where: { id },
        });
    });
}
function findProductByTitle(title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.findFirst({ where: { title } });
    });
}
function createProduct(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.create({
            data: {
                battery: data.battery,
                brandId: data.brandId,
                categoryId: data.categoryId,
                cores: data.cores,
                cpu: data.cpu,
                description: data.description,
                frontCamera: data.frontCamera,
                mainCamera: data.mainCamera,
                ram: data.ram,
                screenSize: data.screenSize,
                slug: data.slug,
                title: data.title,
                cover: data.cover,
                price: data.price,
                discounted: data.discounted,
                stock: data.stock,
                features: data.features,
                connectivity: data.connectivity,
                sensor: data.sensor,
                screenType: data.screenType,
                lens: data.lens,
                megapixels: data.megapixels,
                aperture: data.aperture,
                videoResolution: data.videoResolution,
                batteryLife: data.batteryLife,
                gpu: data.gpu,
                compatibleGames: data.compatibleGames,
                maxResolution: data.maxResolution,
                microphone: data.microphone,
                noiseCancellation: data.noiseCancellation,
                wireless: data.wireless,
                numberOfControllers: data.numberOfControllers,
                storage: data.storage,
                type: data.type,
                zoom: data.zoom,
            },
        });
    });
}
function findVariantByNameAndProductId(name, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.variant.findFirst({
            where: { variant: name, productId },
        });
    });
}
function createVariant(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.variant.create({ data });
    });
}
function findColorByNameAndProductId(name, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.color.findFirst({
            where: { color: name, productId },
        });
    });
}
function createColor(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.color.create({ data });
    });
}
function findProductBySlug(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.findFirst({ where: { slug } });
    });
}
function findProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.findUnique({
            where: { id },
            select: {
                battery: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                color: {
                    select: {
                        id: true,
                        color: true,
                    },
                },
                cores: true,
                cover: true,
                cpu: true,
                description: true,
                frontCamera: true,
                id: true,
                mainCamera: true,
                price: true,
                ram: true,
                screenSize: true,
                slug: true,
                discounted: true,
                title: true,
                features: true,
                connectivity: true,
                sensor: true,
                screenType: true,
                lens: true,
                zoom: true,
                megapixels: true,
                aperture: true,
                videoResolution: true,
                batteryLife: true,
                gpu: true,
                compatibleGames: true,
                maxResolution: true,
                microphone: true,
                noiseCancellation: true,
                numberOfControllers: true,
                storage: true,
                type: true,
                wireless: true,
                variant: {
                    select: {
                        id: true,
                        price: true,
                        variant: true,
                    },
                },
                stock: true,
            },
        });
    });
}
function updateProduct(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.update({
            where: { id: data.id },
            data: {
                battery: data.battery,
                brandId: data.brandId,
                categoryId: data.categoryId,
                cores: data.cores,
                cpu: data.cpu,
                description: data.description,
                frontCamera: data.frontCamera,
                mainCamera: data.mainCamera,
                ram: data.ram,
                screenSize: data.screenSize,
                slug: data.slug,
                title: data.title,
                cover: data.cover,
                price: data.price,
                discounted: data.discounted,
                stock: data.stock,
                features: data.features,
                connectivity: data.connectivity,
                sensor: data.sensor,
                screenType: data.screenType,
                lens: data.lens,
                zoom: data.zoom,
                megapixels: data.megapixels,
                aperture: data.aperture,
                videoResolution: data.videoResolution,
                batteryLife: data.batteryLife,
                gpu: data.gpu,
                compatibleGames: data.compatibleGames,
                maxResolution: data.maxResolution,
                microphone: data.microphone,
                noiseCancellation: data.noiseCancellation,
                wireless: data.wireless,
                numberOfControllers: data.numberOfControllers,
                storage: data.storage,
                type: data.type,
            },
        });
    });
}
function getVariantbyId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.variant.findUnique({
            where: { id },
        });
    });
}
function getColorbyId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.color.findUnique({
            where: { id },
        });
    });
}
function deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.delete({
            where: { id },
        });
    });
}
function updateVariant(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.variant.update({
            where: { id: data.id },
            data: {
                variant: data.variant,
                price: data.price,
            },
        });
    });
}
function updateColor(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.color.update({
            where: { id: data.id },
            data: {
                color: data.color,
            },
        });
    });
}
function deleteVariant(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.variant.delete({
            where: { id },
        });
    });
}
function deleteColor(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.color.delete({
            where: { id },
        });
    });
}
function getVariantbyProductId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.variant.findMany({
            where: { productId: id },
        });
    });
}
function getColorbyProductId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.color.findMany({
            where: { productId: id },
        });
    });
}
function getProductsByCategory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.findMany({
            where: { categoryId: id },
        });
    });
}
function getProductFilterData(_a) {
    return __awaiter(this, arguments, void 0, function* ({ cateID }) {
        return yield db_1.default.product.findMany({
            where: {
                categoryId: cateID,
            },
            select: {
                lens: true,
                aperture: true,
                cpu: true,
                ram: true,
                screenType: true,
                screenSize: true,
                storage: true,
                gpu: true,
                mainCamera: true,
                frontCamera: true,
                maxResolution: true,
                megapixels: true,
                zoom: true,
                videoResolution: true,
                brand: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    });
}
function getSearchedProducts(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            select: {
                battery: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                color: {
                    select: {
                        id: true,
                        color: true,
                    },
                },
                cores: true,
                cover: true,
                cpu: true,
                description: true,
                frontCamera: true,
                id: true,
                mainCamera: true,
                price: true,
                ram: true,
                screenSize: true,
                slug: true,
                discounted: true,
                title: true,
                features: true,
                connectivity: true,
                sensor: true,
                screenType: true,
                lens: true,
                zoom: true,
                megapixels: true,
                aperture: true,
                videoResolution: true,
                batteryLife: true,
                gpu: true,
                compatibleGames: true,
                maxResolution: true,
                microphone: true,
                noiseCancellation: true,
                numberOfControllers: true,
                storage: true,
                type: true,
                wireless: true,
                variant: {
                    select: {
                        id: true,
                        price: true,
                        variant: true,
                    },
                },
                stock: true,
            },
        });
    });
}
function Delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.delete({
            where: {
                id,
            },
        });
    });
}
