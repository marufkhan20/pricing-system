import { Router } from "express";
import {
  addNewProductController,
  deleteProductController,
  editProductController,
  editProductViewController,
  getAllProductController,
  importProductsController,
} from "../controllers/productController.js";
import privateRoute from "../middlewares/privateRoute.js";
import upload from "../upload.js";

const router = Router();

router.get("/", privateRoute, getAllProductController);

router.post("/", (req, res) => {
  res.render("index.ejs");
});

// add product view
router.get("/add-product", privateRoute, (req, res) => {
  res.render("add_product.ejs", {
    path: "products",
    title: "Add Product",
  });
});

// add new product
router.post("/add-product", privateRoute, addNewProductController);

// edit product
router.get("/edit-product/:id", privateRoute, editProductViewController);

// import products
router.post(
  "/import-products",
  privateRoute,
  upload.single("file"),
  importProductsController
);

router.post("/edit-product/:id", privateRoute, editProductController);

// delete product
router.delete("/products/:id", privateRoute, deleteProductController);

export default router;
