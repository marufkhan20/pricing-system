import { Router } from "express";
import {
  addNewProductController,
  deleteProductController,
  getAllProductController,
} from "../controllers/productController.js";
import privateRoute from "../middlewares/privateRoute.js";
import upload from "../upload.js";

const router = Router();

router.get("/", privateRoute, getAllProductController);

router.post("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/add-product", privateRoute, (req, res) => {
  res.render("add_product.ejs", {
    path: "products",
    title: "Add Product",
  });
});

// add new product
router.post(
  "/add-product",
  privateRoute,
  upload.single("image"),
  addNewProductController
);

// delete product
router.delete("/products/:id", privateRoute, deleteProductController);

export default router;
