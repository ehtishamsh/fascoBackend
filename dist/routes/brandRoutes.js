"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brandController_1 = require("../controllers/brandController");
const router = (0, express_1.Router)();
router.get("/brands", brandController_1.GetAll);
router.post("/brands/new", brandController_1.Create);
router.delete("/brands/:id", brandController_1.deleteBrand);
exports.default = router;
