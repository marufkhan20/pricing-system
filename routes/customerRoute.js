import { Router } from "express";
import {
  addNewCustomerController,
  deleteCustomerController,
  getAllCustomersController,
  getCustomerController,
} from "../controllers/customerController.js";
import privateRoute from "../middlewares/privateRoute.js";

const router = Router();

router.get("/customers", privateRoute, getAllCustomersController);

router.get("/add-customer", privateRoute, (req, res) => {
  res.render("add_customer.ejs", {
    path: "customers",
  });
});

router.get("/customers/:id", privateRoute, getCustomerController);

router.post("/add-customer", privateRoute, addNewCustomerController);

router.delete("/customers/:id", privateRoute, deleteCustomerController);

export default router;
