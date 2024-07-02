import Customer from "../models/Customer.js";

// get all customers controller
export const getAllCustomersController = async (req, res) => {
  try {
    // get all customers
    const customers = await Customer.find();
    res.render("customers.ejs", {
      customers,
      path: "customers",
      title: "Customers",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// get single customer controller
export const getCustomerController = async (req, res) => {
  try {
    const { id } = req.params || {};

    // get the customer
    const customer = await Customer.findById(id);
    res.status(200).json({ customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// add new customer controller
export const addNewCustomerController = async (req, res) => {
  try {
    const {
      name,
      freightRate,
      markUp,
      commission1,
      commission2,
      baseUnitModifier,
    } = req.body || {};

    // check validation error
    const validationErrors = {};

    if (!name) {
      validationErrors.name = "Name is required!!";
    }

    if (!freightRate) {
      validationErrors.freightRate = "Freight rate is required!!";
    }

    if (!markUp) {
      validationErrors.markUp = "Mark up is required!!";
    }

    if (!commission1) {
      validationErrors.commission1 = "Commission 1 is required!!";
    }

    if (!commission2) {
      validationErrors.commission2 = "Commission 2 is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("name", name);
      req.flash("freightRate", freightRate);
      req.flash("markUp", markUp);
      req.flash("commission1", commission1);
      req.flash("commission2", commission2);
      req.flash("baseUnitModifier", baseUnitModifier);
      req.flash("errors", JSON.stringify(validationErrors));
      return res.redirect("/add-customer");
    }

    // add new customer
    const newCustomer = new Customer({
      name,
      freightRate: Number(freightRate),
      markUp: Number(markUp),
      commission1: Number(commission1),
      commission2: Number(commission2),
      baseUnitModifier,
    });

    await newCustomer.save();

    res.redirect("/customers");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// edit customer view controller
export const editCustomerViewController = async (req, res) => {
  try {
    const { id } = req.params || {};

    // get the customer
    const customer = await Customer.findById(id);
    req.flash("id", customer?.id);
    req.flash("name", customer?.name);
    req.flash("freightRate", customer?.freightRate);
    req.flash("markUp", customer?.markUp);
    req.flash("commission1", customer?.commission1);
    req.flash("commission2", customer?.commission2);
    req.flash("baseUnitModifier", customer?.baseUnitModifier);

    res.render("edit_customer.ejs", {
      path: "customers",
      title: "Edit Customer",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// edit customer controller
export const editCustomerController = async (req, res) => {
  try {
    const {
      name,
      freightRate,
      markUp,
      baseUnitModifier,
      commission1,
      commission2,
    } = req.body || {};

    const { id } = req.params || {};

    // check validation error
    const validationErrors = {};

    if (!name) {
      validationErrors.name = "Name is required!!";
    }

    if (!freightRate) {
      validationErrors.freightRate = "Freight rate is required!!";
    }

    if (!markUp) {
      validationErrors.markUp = "Mark up is required!!";
    }

    if (!commission1) {
      validationErrors.commission1 = "Commission 1 is required!!";
    }

    if (!commission2) {
      validationErrors.commission2 = "Commission 2 is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("name", name);
      req.flash("freightRate", freightRate);
      req.flash("markUp", markUp);
      req.flash("commission1", commission1);
      req.flash("commission2", commission2);
      req.flash("errors", JSON.stringify(validationErrors));
      return res.redirect("/add-customer");
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, {
      $set: {
        name,
        freightRate: Number(freightRate),
        markUp: Number(markUp),
        commission1: Number(commission1),
        commission2: Number(commission2),
        baseUnitModifier,
      },
    });

    if (updatedCustomer) {
      res.redirect("/customers");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// delete customer controller
export const deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params || {};

    // delete customer
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (deletedCustomer) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};
