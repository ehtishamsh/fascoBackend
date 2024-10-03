"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
router.get("/categories", categoryController_1.getAllCategories);
router.post("/categories/new", categoryController_1.createCategory);
router.delete("/categories/:id", categoryController_1.deleteCategory);
exports.default = router;
