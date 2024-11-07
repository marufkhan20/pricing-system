import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import generateOrderFile from "../utils/generateOrderFile.js";
import { getProducts } from "../utils/index.js";

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
    // const { page = 1, limit = 20 } = req.query;
    const { id } = req.params || {};

    // get order
    const order = await Order.findById(id);

    // const startIndex = Number((page - 1) * Number(limit));
    // const endIndex = Number(startIndex + Number(limit));

    // const paginatedProducts = order?.products.slice(startIndex, endIndex);

    res.render("order_details.ejs", {
      order,
      path: "orders",
      title: order?.name,
      products: order.products,
      // totalPages: Math.ceil(order.products.length / limit),
      // currentPage: parseInt(page),
      // limit: parseInt(limit),
      startIndex: 0,
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
    const products = await getProducts({
      customer,
      freightRate,
      commission1,
      commission2,
      markUp,
    });

    // const { filename, path } = await generateOrderFile(selectedProducts);

    const orders = await Order.find().countDocuments();

    // add new order
    const newOrder = new Order({
      customer,
      name: `Price List ${Number(orders) + 1}`,
      createdDate: Date.now(),
      products,
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
      const customers = await Customer.find();

      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("customer", customer);
      req.flash("id", id);
      req.flash("freightRate", freightRate);
      req.flash("commission1", commission1);
      req.flash("commission2", commission2);
      req.flash("markUp", markUp);
      return res.render("edit_order.ejs", {
        path: "orders",
        title: "Edit Price List",
        customers,
      });
    }

    const products = await getProducts({
      customer,
      freightRate,
      commission1,
      commission2,
      markUp,
    });

    await Order.findByIdAndUpdate(id, {
      $set: {
        customer,
        products,
        freightRate,
        commission1,
        commission2,
        markUp,
      },
    });

    res.redirect(`/order/${id}`);
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

    await Order.findByIdAndDelete(id);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// download order data controller
export const downloadOrderDataController = async (req, res) => {
  const { id } = req.params || {};

  // Fetch the order by ID
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Generate the order file and save it
  const { filename } = await generateOrderFile(order.products);

  setTimeout(() => {
    if (filename) {
      const filePath = `public/orders/${filename}`;
      res.download(filePath);
    }
  }, 1500);
};
