import { Router } from "express";
import {
  addNewOrderController,
  addOrderViewController,
  deleteOrderController,
  downloadOrderDataController,
  editOrderController,
  editOrderViewController,
  getAllOrderController,
  getOrderDetailsController,
} from "../controllers/orderController.js";
import privateRoute from "../middlewares/privateRoute.js";

const router = Router();

router.get("/order", privateRoute, getAllOrderController);

router.post("/order", (req, res) => {
  res.render("order.ejs", {
    path: "orders",
    title: "Price List",
  });
});

router.get("/add-order", privateRoute, addOrderViewController);

// get order details
router.get("/order/:id", privateRoute, getOrderDetailsController);

// add new order
router.post("/add-order", privateRoute, addNewOrderController);

// edit order
router.get("/edit-order/:id", privateRoute, editOrderViewController);
router.post("/edit-order/:id", privateRoute, editOrderController);

// delete order
router.delete("/order/:id", privateRoute, deleteOrderController);

router.get("/order/download/:id", downloadOrderDataController);

export default router;
