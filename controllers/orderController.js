import fs from "fs";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import generateOrderFile from "../utils/generateOrderFile.js";

// get all orders controller
export const getAllOrderController = async (req, res) => {
  try {
    // get all orders
    const orders = await Order.find();
    res.render("order.ejs", {
      orders,
      path: "orders",
      title: "Price List",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// get order details controller
export const getOrderDetailsController = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { id } = req.params || {};

    // get order
    const order = await Order.findById(id);

    const startIndex = Number((page - 1) * Number(limit));
    const endIndex = Number(startIndex + Number(limit));

    const paginatedProducts = order?.products.slice(startIndex, endIndex);

    res.render("order_details.ejs", {
      order,
      path: "orders",
      title: order?.name,
      products: paginatedProducts,
      totalPages: Math.ceil(order.products.length / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit),
      startIndex: (page - 1) * limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// add order view controller
export const addOrderViewController = async (req, res) => {
  try {
    // get all customers
    const customers = await Customer.find();
    res.render("add_order.ejs", {
      customers,
      path: "orders",
      title: "Add Price List",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// add new Order controller
export const addNewOrderController = async (req, res) => {
  try {
    const { customer, freightRate, commission1, commission2, markUp } =
      req.body || {};

    // check validation errors
    const validationErrors = {};

    if (!customer) {
      validationErrors.customer = "Customer is required!!";
    }

    if (!freightRate) {
      validationErrors.freightRate = "Freight Rate is required!!";
    }

    if (!commission1) {
      validationErrors.commission1 = "Commission 1 is required!!";
    }

    if (!commission2) {
      validationErrors.commission2 = "Commission 2 is required!!";
    }

    if (!markUp) {
      validationErrors.markUp = "Mark Up is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("customer", customer);
      req.flash("freightRate", freightRate);
      req.flash("commission1", commission1);
      req.flash("commission2", commission2);
      req.flash("markUp", markUp);
      return res.redirect("/add-Order");
    }

    // get the products data
    const products = await Product.find();
    const selectedProducts = [];

    // get customer
    const customerData = await Customer.findById(customer);

    products?.forEach((product) => {
      const {
        _id,
        image,
        wcCode,
        boxCode,
        price,
        ti,
        hi,
        description,
        upc,
        pack,
        tag1,
        tag2,
      } = product || {};

      // calculate base unit price
      let baseUnitPrice = 0;
      let baseUnitModifier = customerData?.baseUnitModifier;

      if (baseUnitModifier && baseUnitModifier?.includes("-")) {
        baseUnitModifier = baseUnitModifier?.replace("-", "");

        baseUnitPrice = Number(price) - Number(baseUnitModifier);
      } else if (baseUnitModifier && baseUnitModifier?.includes("+")) {
        baseUnitModifier = baseUnitModifier?.replace("+", "");

        baseUnitPrice = Number(price) + Number(baseUnitModifier);
      } else {
        baseUnitPrice = Number(price);
      }

      const casesPerPallet = Number(ti) * Number(hi);

      // commission 1 per unit
      let commission1PerUnit =
        Number(baseUnitPrice) * (Number(commission1) / 100);

      commission1PerUnit = Math.ceil(commission1PerUnit * 100) / 100;

      // commission per case
      let commission1PerCase = commission1PerUnit * Number(pack);

      commission1PerCase = Math.ceil(commission1PerCase * 100) / 100;

      // commission 2 per unit
      let commission2PerUnit =
        Number(baseUnitPrice) * (Number(commission2) / 100);

      commission2PerUnit = Math.ceil(commission2PerUnit * 100) / 100;

      // commission 2 per case
      let commission2PerCase = commission2PerUnit * Number(pack);

      commission2PerCase = Math.ceil(commission2PerCase * 100) / 100;

      // const markUpUnit = Number(baseUnitPrice) * (Number(markUp) / 100);

      // freight per case
      let freightPerCase = Number(freightRate) / casesPerPallet;

      freightPerCase = Math.ceil(freightPerCase * 100) / 100;

      // freight per unit
      let freightPerUnit = Number(freightPerCase) / Number(pack);

      freightPerUnit = Math.ceil(freightPerUnit * 100) / 100;

      // mark up unit
      let markUpUnit =
        (Number(baseUnitPrice) +
          commission1PerUnit +
          commission2PerUnit +
          freightPerUnit) *
        (Number(markUp) / 100);

      markUpUnit = Math.ceil(markUpUnit * 100) / 100;

      // mark up case
      let markUpCase = markUpUnit * Number(pack);

      markUpCase = Math.ceil(markUpCase * 100) / 100;

      // unit
      let unit =
        commission1PerUnit +
        commission2PerUnit +
        freightPerUnit +
        markUpUnit +
        Number(baseUnitPrice);

      unit = Number((Math.ceil(unit * 20) / 20).toFixed(2));

      // ((2.00 * commission1) + (2.00 * commission2) + 2.00)) * markup
      const caseNo = unit * Number(pack);

      const productObj = {
        _id,
        tag1,
        tag2,
        image,
        pack,
        wcCode,
        boxCode,
        ti,
        hi,
        description,
        unit: `$ ${unit?.toFixed(2)}`,
        case: `$ ${caseNo?.toFixed(2)}`,
        casesPerPallet,
        upc,
        freightPerUnit: `$ ${freightPerUnit?.toFixed(2)}`,
        freightPerCase: `$ ${freightPerCase?.toFixed(2)}`,
        commission1PerUnit: `$ ${commission1PerUnit?.toFixed(2)}`,
        commission1PerCase: `$ ${commission1PerCase?.toFixed(2)}`,
        commission2PerUnit: `$ ${commission2PerUnit?.toFixed(2)}`,
        commission2PerCase: `$ ${commission2PerCase?.toFixed(2)}`,
        markUpUnit: `$ ${markUpUnit?.toFixed(2)}`,
        markUpCase: `$ ${markUpCase?.toFixed(2)}`,
      };
      selectedProducts.push(productObj);
    });

    const { filename, path } = await generateOrderFile(selectedProducts);

    const orders = await Order.find().countDocuments();

    // add new order
    const newOrder = new Order({
      customer,
      name: `Price List ${Number(orders) + 1}`,
      createdDate: Date.now(),
      orderFileName: filename,
      path,
      products: selectedProducts,
      freightRate,
      commission1,
      commission2,
      markUp,
    });

    await newOrder.save();

    res.redirect(`/order/${newOrder?._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// edit order view controller
export const editOrderViewController = async (req, res) => {
  try {
    const { id } = req.params || {};

    // get the order
    const order = await Order.findById(id);

    const customers = await Customer.find();

    const orderProducts = order?.products?.map((product) => product?._id);

    req.flash("id", order?.id);
    req.flash("customer", order?.customer);
    req.flash("products", orderProducts);
    req.flash("freightRate", order?.freightRate);
    req.flash("commission1", order?.commission1);
    req.flash("commission2", order?.commission2);
    req.flash("markUp", order?.markUp);

    res.render("edit_order.ejs", {
      path: "orders",
      title: "Edit Price List",
      customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// edit Order controller
export const editOrderController = async (req, res) => {
  try {
    const { customer, freightRate, commission1, commission2, markUp } =
      req.body || {};

    const { id } = req.params || {};

    // check validation errors
    const validationErrors = {};

    if (!customer) {
      validationErrors.customer = "Customer is required!!";
    }

    if (!freightRate) {
      validationErrors.freightRate = "Freight Rate is required!!";
    }

    if (!commission1) {
      validationErrors.commission1 = "Commission 1 is required!!";
    }

    if (!commission2) {
      validationErrors.commission2 = "Commission 2 is required!!";
    }

    if (!markUp) {
      validationErrors.markUp = "Mark Up is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("customer", customer);
      req.flash("freightRate", freightRate);
      req.flash("commission1", commission1);
      req.flash("commission2", commission2);
      req.flash("markUp", markUp);
      return res.redirect("/add-Order");
    }

    // get the products data
    const products = await Product.find();
    const selectedProducts = [];

    // get customer
    const customerData = await Customer.findById(customer);

    products?.forEach((product) => {
      const {
        _id,
        image,
        wcCode,
        boxCode,
        price,
        ti,
        hi,
        description,
        upc,
        pack,
        tag1,
        tag2,
      } = product || {};

      // calculate base unit price
      let baseUnitPrice = 0;
      let baseUnitModifier = customerData?.baseUnitModifier;

      if (baseUnitModifier && baseUnitModifier?.includes("-")) {
        baseUnitModifier = baseUnitModifier?.replace("-", "");

        baseUnitPrice = Number(price) - Number(baseUnitModifier);
      } else if (baseUnitModifier && baseUnitModifier?.includes("+")) {
        baseUnitModifier = baseUnitModifier?.replace("+", "");

        baseUnitPrice = Number(price) + Number(baseUnitModifier);
      } else {
        baseUnitPrice = Number(price);
      }

      const casesPerPallet = Number(ti) * Number(hi);

      // commission 1 per unit
      let commission1PerUnit =
        Number(baseUnitPrice) * (Number(commission1) / 100);

      commission1PerUnit = Math.ceil(commission1PerUnit * 100) / 100;

      // commission per case
      let commission1PerCase = commission1PerUnit * Number(pack);

      commission1PerCase = Math.ceil(commission1PerCase * 100) / 100;

      // commission 2 per unit
      let commission2PerUnit =
        Number(baseUnitPrice) * (Number(commission2) / 100);

      commission2PerUnit = Math.ceil(commission2PerUnit * 100) / 100;

      // commission 2 per case
      let commission2PerCase = commission2PerUnit * Number(pack);

      commission2PerCase = Math.ceil(commission2PerCase * 100) / 100;

      // const markUpUnit = Number(baseUnitPrice) * (Number(markUp) / 100);

      // freight per case
      let freightPerCase = Number(freightRate) / casesPerPallet;

      freightPerCase = Math.ceil(freightPerCase * 100) / 100;

      // freight per unit
      let freightPerUnit = Number(freightPerCase) / Number(pack);

      freightPerUnit = Math.ceil(freightPerUnit * 100) / 100;

      // mark up unit
      let markUpUnit =
        (Number(baseUnitPrice) +
          commission1PerUnit +
          commission2PerUnit +
          freightPerUnit) *
        (Number(markUp) / 100);

      markUpUnit = Math.ceil(markUpUnit * 100) / 100;

      // mark up case
      let markUpCase = markUpUnit * Number(pack);

      markUpCase = Math.ceil(markUpCase * 100) / 100;

      // unit
      let unit =
        commission1PerUnit +
        commission2PerUnit +
        freightPerUnit +
        markUpUnit +
        Number(baseUnitPrice);

      unit = Number((Math.ceil(unit * 20) / 20).toFixed(2));

      // ((2.00 * commission1) + (2.00 * commission2) + 2.00)) * markup
      const caseNo = unit * Number(pack);

      const productObj = {
        _id,
        tag1,
        tag2,
        image,
        pack,
        wcCode,
        boxCode,
        ti,
        hi,
        description,
        unit: `$ ${unit?.toFixed(2)}`,
        case: `$ ${caseNo?.toFixed(2)}`,
        casesPerPallet,
        upc,
        freightPerUnit: `$ ${freightPerUnit?.toFixed(2)}`,
        freightPerCase: `$ ${freightPerCase?.toFixed(2)}`,
        commission1PerUnit: `$ ${commission1PerUnit?.toFixed(2)}`,
        commission1PerCase: `$ ${commission1PerCase?.toFixed(2)}`,
        commission2PerUnit: `$ ${commission2PerUnit?.toFixed(2)}`,
        commission2PerCase: `$ ${commission2PerCase?.toFixed(2)}`,
        markUpUnit: `$ ${markUpUnit?.toFixed(2)}`,
        markUpCase: `$ ${markUpCase?.toFixed(2)}`,
      };
      selectedProducts.push(productObj);
    });

    const { filename, path } = await generateOrderFile(selectedProducts);

    const updatedOrder = await Order.findByIdAndUpdate(id, {
      $set: {
        customer,
        orderFileName: filename,
        path,
        products: selectedProducts,
        freightRate,
        commission1,
        commission2,
        markUp,
      },
    });

    if (updatedOrder) {
      // delete existing order file
      fs.unlink(`public${updatedOrder?.path}`, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }

        res.redirect(`/order/${id}`);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// delete Order controller
export const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params || {};

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (deletedOrder) {
      // delete order file
      fs.unlink(`public${deletedOrder?.path}`, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }

        res.status(200).json({ success: true });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};
