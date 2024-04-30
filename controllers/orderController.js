import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import generateOrderFile from "../utils/generateOrderFile.js";

// get all orders controller
export const getAllOrderController = async (req, res) => {
  try {
    // get all orders
    fs.readFile("data/orders.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      res.render("order.ejs", {
        orders: JSON.parse(data),
        path: "orders",
        title: "Orders",
      });
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
    const { id } = req.params || {};

    // get all orders
    fs.readFile("data/orders.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      const orders = JSON.parse(data);

      // get single order
      const order = orders?.find((item) => item?.id === id);

      console.log("order", order);

      res.render("order_details.ejs", {
        order,
        path: "orders",
        title: order?.name,
      });
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
    fs.readFile("data/customers.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // get all products
      fs.readFile("data/products.json", "utf8", (err, products) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error reading file");
          return;
        }

        res.render("add_order.ejs", {
          customers: JSON.parse(data),
          products: JSON.parse(products),
          path: "orders",
          title: "Add Order",
        });
      });
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
    const {
      customer,
      products,
      freightRate,
      commission1,
      commission2,
      markUp,
    } = req.body || {};

    // check validation errors
    const validationErrors = {};

    if (!customer) {
      validationErrors.customer = "Customer is required!!";
    }

    if (!products) {
      validationErrors.products = "Products is required!!";
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
      req.flash("products", products);
      req.flash("freightRate", freightRate);
      req.flash("commission1", commission1);
      req.flash("commission2", commission2);
      req.flash("markUp", markUp);
      return res.redirect("/add-Order");
    }

    // get the products data
    fs.readFile("data/products.json", "utf8", async (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // Parse JSON data
      const productsData = JSON.parse(data);

      let productsIdArray = [];

      if (typeof products === "string") {
        productsIdArray.push(products);
      } else {
        productsIdArray = products;
      }

      const selectedProducts = [];

      productsData?.forEach((product) => {
        productsIdArray?.forEach((productId) => {
          if (product?.id === productId) {
            const {
              image,
              wcCode,
              boxCode,
              price,
              ti,
              hi,
              description,
              upc,
              pack,
            } = product || {};

            const casesPerPallet = Number(ti) * Number(hi);

            const commission1PerUnit =
              Number(price) * (Number(commission1) / 100);

            const commission1PerCase = commission1PerUnit * Number(pack);

            const commission2PerUnit =
              Number(price) * (Number(commission2) / 100);

            const commission2PerCase = commission2PerUnit * Number(pack);

            // const markUpUnit = Number(price) * (Number(markUp) / 100);

            const freightPerCase = Number(freightRate) / casesPerPallet;
            const freightPerUnit = Number(freightPerCase) / Number(pack);

            const markUpUnit =
              (Number(price) +
                commission1PerUnit +
                commission2PerUnit +
                freightPerUnit) *
              (Number(markUp) / 100);

            const markUpCase = markUpUnit * Number(pack);

            const unit =
              commission1PerUnit +
              commission2PerUnit +
              freightPerUnit +
              markUpUnit +
              Number(price);

            // ((2.00 * commission1) + (2.00 * commission2) + 2.00)) * markup
            const caseNo = unit * Number(pack);

            const productObj = {
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
          }
        });
      });

      const { filename, path } = await generateOrderFile(selectedProducts);

      // get the orders data
      fs.readFile("data/orders.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error reading file");
          return;
        }

        // Parse JSON data
        const ordersData = JSON.parse(data);

        const newOrder = {
          id: uuidv4(),
          name: `Order ${Number(ordersData?.length) + 1}`,
          createdDate: Date.now(),
          orderFileName: filename,
          path,
          products: selectedProducts,
          freightRate,
          commission1,
          commission2,
          markUp,
        };

        // add new order data
        fs.writeFile(
          "data/orders.json",
          JSON.stringify([...ordersData, newOrder]),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error writing to file");
              return;
            }

            res.redirect(`/order/${newOrder?.id}`);
          }
        );
      });
    });
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

    // get the orders data
    fs.readFile("data/orders.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // Parse JSON data
      const orders = JSON.parse(data);

      const deletedOrders = orders?.filter((order) => order?.id !== id);

      // delete Order
      fs.writeFile("data/orders.json", JSON.stringify(deletedOrders), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing to file");
          return;
        }

        res.status(200).json({ success: true });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};
