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
exports.deleteProduct = exports.getProductsBySearch = exports.getFilterData = exports.getProductsByCate = exports.editProduct = exports.getProductByID = exports.getProductController = exports.createProductController = exports.getAllProductsController = void 0;
const Product_1 = require("../services/Product");
const Category_1 = require("../services/Category");
const Order_1 = require("../services/Order");
const Review_1 = require("../services/Review");
const getAllProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, Product_1.getAllProducts)();
        const [productsVariants, productsColors] = yield Promise.all([
            (0, Product_1.getAllVariants)(),
            (0, Product_1.getAllColors)(),
        ]);
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        const productsWithDetails = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            const getCateName = yield (0, Product_1.getCategoryNameById)(product.categoryId);
            const getBrandName = yield (0, Product_1.getBrandNameById)(product.brandId);
            const variants = productsVariants
                .filter((variant) => variant.productId === product.id)
                .map((variant) => ({ name: variant.variant, price: variant.price }));
            const numberOfOrders = yield (0, Order_1.getOrderByProductId)(product.id);
            const rating = yield (0, Review_1.getReviewsByProductID)(product.id);
            const allRatings = rating
                .map((review) => review.rating || 0)
                .reduce((acc, curr) => acc + curr, 0);
            const colors = productsColors
                .filter((color) => color.productId === product.id)
                .map((color) => ({ name: color.color }));
            return Object.assign(Object.assign({}, product), { category: (getCateName === null || getCateName === void 0 ? void 0 : getCateName.name) || null, brand: (getBrandName === null || getBrandName === void 0 ? void 0 : getBrandName.name) || null, variants, orders: numberOfOrders.length, rating: rating.length > 0 ? allRatings / rating.length : 0, totalReviews: rating.length, colors });
        })));
        res.status(200).json({
            products: productsWithDetails,
            message: "Products fetched successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.getAllProductsController = getAllProductsController;
// Create Product
const createProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, cover, price, discounted, stock, brandId, categoryId, variants, colors, screenSize, cpu, slug, cores, mainCamera, ram, frontCamera, battery, screenType, sensor, zoom, features, connectivity, lens, megapixels, aperture, videoResolution, batteryLife, gpu, compatibleGames, maxResolution, microphone, noiseCancellation, wireless, numberOfControllers, storage, type, } = req.body;
        const checkifexist = yield (0, Product_1.findProductByTitle)(title);
        if (checkifexist) {
            return res.status(400).send("Product already exists");
        }
        const newProduct = yield (0, Product_1.createProduct)({
            battery,
            brandId,
            categoryId,
            cpu,
            cores,
            cover,
            description,
            frontCamera,
            discounted,
            mainCamera,
            ram,
            screenSize,
            slug,
            title,
            price,
            stock,
            screenType,
            sensor,
            zoom,
            features,
            connectivity,
            lens,
            megapixels,
            aperture,
            videoResolution,
            batteryLife,
            gpu,
            compatibleGames,
            maxResolution,
            microphone,
            noiseCancellation,
            wireless,
            numberOfControllers,
            storage,
            type,
        });
        if (!newProduct) {
            return res.status(500).send("Failed to create product");
        }
        let variantIds = [];
        if (variants.length > 0) {
            const newVariants = yield Promise.all(variants.map((variant) => __awaiter(void 0, void 0, void 0, function* () {
                const existingVariant = yield (0, Product_1.findVariantByNameAndProductId)(variant.variant, newProduct.id);
                if (existingVariant) {
                    variantIds.push(existingVariant.id);
                    return existingVariant;
                }
                const newVariant = yield (0, Product_1.createVariant)({
                    price: String(variant.price),
                    productId: newProduct.id,
                    variant: variant.variant,
                });
                if (newVariant) {
                    variantIds.push(newVariant.id);
                }
                return newVariant;
            })));
            if (!newVariants) {
                return res.status(500).send("Failed to create variants");
            }
        }
        let colorIds = [];
        if (colors.length > 0) {
            const newColors = yield Promise.all(colors.map((color) => __awaiter(void 0, void 0, void 0, function* () {
                const existingColor = yield (0, Product_1.findColorByNameAndProductId)(color.name, newProduct.id);
                if (existingColor) {
                    colorIds.push(existingColor.id);
                    return existingColor;
                }
                const newColor = yield (0, Product_1.createColor)({
                    productId: newProduct.id,
                    color: color.name,
                });
                if (newColor) {
                    colorIds.push(newColor.id);
                }
                return newColor;
            })));
            if (!newColors) {
                return res.status(500).send("Failed to create colors");
            }
        }
        return res.json({
            newProduct,
            variantIds,
            colorIds,
            status: 200,
            message: "Product created successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});
exports.createProductController = createProductController;
// Get Product by Slug
const getProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getProduct = yield (0, Product_1.findProductBySlug)(id);
        if (!getProduct) {
            return res.status(404).send("Product not found");
        }
        const [productsVariants, productsColors] = yield Promise.all([
            (0, Product_1.getAllVariants)(),
            (0, Product_1.getAllColors)(),
        ]);
        const getCateName = yield (0, Product_1.getCategoryNameById)(getProduct.categoryId);
        const getBrandName = yield (0, Product_1.getBrandNameById)(getProduct.brandId);
        const variants = productsVariants
            .filter((variant) => variant.productId === getProduct.id)
            .map((variant) => ({
            id: variant.id,
            name: variant.variant,
            price: variant.price,
        }));
        const colors = productsColors
            .filter((color) => color.productId === getProduct.id)
            .map((color) => ({ id: color.id, name: color.color }));
        const product = Object.assign(Object.assign({}, getProduct), { category: getCateName === null || getCateName === void 0 ? void 0 : getCateName.name, brand: getBrandName === null || getBrandName === void 0 ? void 0 : getBrandName.name, variants,
            colors });
        return res.json({
            product,
            status: 200,
            message: "Product fetched successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});
exports.getProductController = getProductController;
const getProductByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getProduct = yield (0, Product_1.findProductById)(id);
        if (!getProduct) {
            return res.status(404).send("Product not found");
        }
        return res.json({
            data: getProduct,
            status: 200,
            message: "Product fetched successfully",
        });
    }
    catch (_a) {
        return res.status(500).send("Failed to fetch product");
    }
});
exports.getProductByID = getProductByID;
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, price, stock, description, categoryId, brandId, variants, cover, discounted, screenSize, cpu, cores, mainCamera, frontCamera, battery, ram, slug, colors, screenType, sensor, zoom, features, connectivity, lens, megapixels, aperture, videoResolution, batteryLife, gpu, compatibleGames, maxResolution, microphone, noiseCancellation, wireless, numberOfControllers, storage, type, } = req.body;
        const checkifexist = yield (0, Product_1.findProductById)(id);
        if (!checkifexist) {
            return res.status(404).send("Product not found");
        }
        const findCategory = yield (0, Product_1.getCategoryNameById)(categoryId);
        if (!findCategory) {
            return res.status(404).send("Category not found");
        }
        const findBrand = yield (0, Product_1.getBrandNameById)(brandId);
        if (!findBrand) {
            return res.status(404).send("Brand not found");
        }
        const updateProductdetails = yield (0, Product_1.updateProduct)({
            id,
            title,
            price,
            discounted,
            stock,
            description,
            categoryId,
            brandId,
            cover,
            screenSize,
            cpu,
            cores,
            mainCamera,
            frontCamera,
            battery,
            ram,
            slug,
            screenType,
            sensor,
            zoom,
            features,
            connectivity,
            lens,
            megapixels,
            aperture,
            videoResolution,
            batteryLife,
            gpu,
            compatibleGames,
            maxResolution,
            microphone,
            noiseCancellation,
            wireless,
            numberOfControllers,
            storage,
            type,
        });
        if (!updateProductdetails) {
            return res.status(500).send("Failed to update product");
        }
        // Update variants
        if (variants.length > 0) {
            const existingVariants = yield (0, Product_1.getVariantbyProductId)(id);
            const variantNames = variants.map((variant) => variant.id);
            // Delete variants that are no longer present
            existingVariants.forEach((existingVariant) => __awaiter(void 0, void 0, void 0, function* () {
                if (!variantNames.includes(existingVariant.id)) {
                    yield (0, Product_1.deleteVariant)(existingVariant.id);
                }
            }));
            // Add or update variants
            const newVariants = yield Promise.all(variants.map((variant) => __awaiter(void 0, void 0, void 0, function* () {
                const existingVariant = existingVariants.find((ev) => ev.variant === variant.variant);
                if (existingVariant) {
                    return existingVariant;
                }
                const newVariant = yield (0, Product_1.createVariant)({
                    productId: id,
                    variant: variant.variant,
                    price: variant.price,
                });
                return newVariant;
            })));
            if (!newVariants) {
                return res.status(500).send("Failed to create variants");
            }
        }
        // Update colors
        if (colors.length > 0) {
            const existingColors = yield (0, Product_1.getColorbyProductId)(id);
            const colorNames = colors.map((color) => color.id);
            // Delete colors that are no longer present
            existingColors.forEach((existingColor) => __awaiter(void 0, void 0, void 0, function* () {
                if (!colorNames.includes(existingColor.id)) {
                    yield (0, Product_1.deleteColor)(existingColor.id);
                }
            }));
            // // Add or update colors
            const newColors = yield Promise.all(colors.map((color) => __awaiter(void 0, void 0, void 0, function* () {
                const existingColor = existingColors.find((ec) => ec.color === color.color);
                if (existingColor) {
                    return existingColor;
                }
                const newColor = yield (0, Product_1.createColor)({
                    productId: id,
                    color: color.color,
                });
                return newColor;
            })));
            if (!newColors) {
                return res.status(500).send("Failed to create colors");
            }
        }
        return res.json({
            status: 200,
            message: "Product updated successfully",
            data: {
                product: updateProductdetails,
            },
        });
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
exports.editProduct = editProduct;
const getProductsByCate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: catename } = req.params;
        const getcateID = yield (0, Category_1.One)(catename);
        if (!getcateID) {
            return res.status(404).send("Category not found");
        }
        const products = yield (0, Product_1.getProductsByCategory)(getcateID.id);
        if (!products) {
            return res.status(500).send("Failed to fetch products");
        }
        const addRating = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            const rating = yield (0, Review_1.getReviewsByProductID)(product.id);
            const allRatings = rating
                .map((review) => review.rating || 0)
                .reduce((acc, curr) => acc + curr, 0);
            return Object.assign(Object.assign({}, product), { rating: allRatings / rating.length, totalReviews: rating.length });
        })));
        return res.json({
            status: 200,
            message: "Products fetched successfully",
            data: addRating,
        });
    }
    catch (_a) {
        console.log("error");
        return res.status(500).send("Failed to fetch products");
    }
});
exports.getProductsByCate = getProductsByCate;
const getFilterData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: catename } = req.params;
    try {
        const sliceFirst = catename.split("").splice(0, 1);
        const formatedCatename = sliceFirst[0].toUpperCase() + catename.split("").splice(1).join("");
        const getCateID = yield (0, Category_1.One)(formatedCatename);
        if (!getCateID) {
            return res.status(404).send("Category not found");
        }
        const getdata = yield (0, Product_1.getProductFilterData)({ cateID: getCateID.id });
        if (!getdata) {
            return res.status(500).send("Failed to fetch products");
        }
        const allData = {
            lens: [
                ...new Set(getdata.map((item) => item.lens).filter((item) => item !== null)),
            ],
            aperture: [
                ...new Set(getdata.map((item) => item.aperture).filter((item) => item !== null)),
            ],
            cpu: [
                ...new Set(getdata.map((item) => item.cpu).filter((item) => item !== null)),
            ],
            ram: [
                ...new Set(getdata.map((item) => item.ram).filter((item) => item !== null)),
            ],
            screenType: [
                ...new Set(getdata.map((item) => item.screenType).filter((item) => item !== null)),
            ],
            screenSize: [
                ...new Set(getdata.map((item) => item.screenSize).filter((item) => item !== null)),
            ],
            storage: [
                ...new Set(getdata.map((item) => item.storage).filter((item) => item !== null)),
            ],
            gpu: [
                ...new Set(getdata.map((item) => item.gpu).filter((item) => item !== null)),
            ],
            mainCamera: [
                ...new Set(getdata.map((item) => item.mainCamera).filter((item) => item !== null)),
            ],
            frontCamera: [
                ...new Set(getdata
                    .map((item) => item.frontCamera)
                    .filter((item) => item !== null)),
            ],
            maxResolution: [
                ...new Set(getdata
                    .map((item) => item.maxResolution)
                    .filter((item) => item !== null)),
            ],
            megapixels: [
                ...new Set(getdata.map((item) => item.megapixels).filter((item) => item !== null)),
            ],
            zoom: [
                ...new Set(getdata.map((item) => item.zoom).filter((item) => item !== null)),
            ],
            videoResolution: [
                ...new Set(getdata
                    .map((item) => item.videoResolution)
                    .filter((item) => item !== null)),
            ],
            brand: [...new Set(getdata.map((item) => item.brand.name))],
        };
        return res.json({
            status: 200,
            message: "Products fetched successfully",
            data: allData,
        });
    }
    catch (_a) {
        console.log("error");
        return res.status(500).send("Failed to fetch products");
    }
});
exports.getFilterData = getFilterData;
const getProductsBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    try {
        const products = yield (0, Product_1.getSearchedProducts)(query);
        if (!products) {
            return res.status(500).send("Failed to fetch products");
        }
        return res.json({
            status: 200,
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (_a) {
        console.log("error");
        return res.status(500).send("Failed to fetch products");
    }
});
exports.getProductsBySearch = getProductsBySearch;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getProduct = yield (0, Product_1.findProductById)(id);
        if (!getProduct) {
            return res.status(404).send("Product not found");
        }
        const deleteProduct = yield (0, Product_1.Delete)(id);
        if (!deleteProduct) {
            return res.status(404).send("Product not found");
        }
        return res.json({
            status: 200,
            message: "Product deleted successfully",
            data: deleteProduct,
        });
    }
    catch (_a) {
        console.log("error");
        return res.status(500).send("Failed to delete product");
    }
});
exports.deleteProduct = deleteProduct;
