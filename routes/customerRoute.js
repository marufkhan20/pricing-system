import { Router } from "express";
import {
  addNewCustomerController,
  deleteCustomerController,
  editCustomerController,
  editCustomerViewController,
  getAllCustomersController,
  getCustomerController,
} from "../controllers/customerController.js";
import privateRoute from "../middlewares/privateRoute.js";

const router = Router();

// get all customers
router.get("/customers", privateRoute, getAllCustomersController);

// add new customer
router.get("/add-customer", privateRoute, (req, res) => {
  res.render("add_customer.ejs", {
    path: "customers",
    title: "Add Customer",
  });
});
router.post("/add-customer", privateRoute, addNewCustomerController);

// get single customer
router.get("/customers/:id", privateRoute, getCustomerController);

// edit customer
router.get("/edit-customer/:id", privateRoute, editCustomerViewController);
router.post("/edit-customer/:id", privateRoute, editCustomerController);

// delete customer
router.delete("/customers/:id", privateRoute, deleteCustomerController);

export default router;
