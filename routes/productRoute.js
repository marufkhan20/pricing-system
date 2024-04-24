import { Router } from "express";

const router = Router();

router.get("/add-product", (req, res) => {
  res.render("add_product.ejs");
});

export default router;
