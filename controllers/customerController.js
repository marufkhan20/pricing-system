import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// get all customers controller
export const getAllCustomersController = async (req, res) => {
  try {
    // get all customers
    fs.readFile("data/customers.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      res.render("customers.ejs", { customers: JSON.parse(data) });
    });
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
    const { name, freightRate, markUp, commission1, commission2 } =
      req.body || {};

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

    // get the customers data
    fs.readFile("data/customers.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // Parse JSON data
      const customers = JSON.parse(data);

      const allCustomers = [
        ...customers,
        {
          id: uuidv4(),
          name,
          freightRate,
          markUp,
          commission1,
          commission2,
        },
      ];

      // add new customer data
      fs.writeFile(
        "data/customers.json",
        JSON.stringify(allCustomers),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing to file");
            return;
          }

          res.redirect("/customers");
        }
      );
    });
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

    // get the customers data
    fs.readFile("data/customers.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // Parse JSON data
      const customers = JSON.parse(data);

      const deletedCustomers = customers?.filter(
        (customer) => customer?.id !== id
      );

      // add new customer data
      fs.writeFile(
        "data/customers.json",
        JSON.stringify(deletedCustomers),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing to file");
            return;
          }

          res.status(200).json({ success: true });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};