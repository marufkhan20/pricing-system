import { Router } from "express";
import {
  addNewOrderController,
  addOrderViewController,
  deleteOrderController,
  getAllOrderController,
  getOrderDetailsController,
} from "../controllers/orderController.js";
import privateRoute from "../middlewares/privateRoute.js";

const router = Router();

router.get("/order", privateRoute, getAllOrderController);

router.post("/order", (req, res) => {
  res.render("order.ejs");
});

router.get("/add-order", privateRoute, addOrderViewController);

// get order details
router.get("/order/:id", privateRoute, getOrderDetailsController);

// add new order
router.post("/add-order", privateRoute, addNewOrderController);

// delete order
router.delete("/order/:id", privateRoute, deleteOrderController);

router.get("/order/download/:filename", (req, res) => {
  const { filename } = req.params || {};
  res.download(`public/orders/${filename}`);
});

export default router;