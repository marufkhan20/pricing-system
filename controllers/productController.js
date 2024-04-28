import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// get all products controller
export const getAllProductController = async (req, res) => {
  try {
    // get all products
    fs.readFile("data/products.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      res.render("index.ejs", { products: JSON.parse(data) });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// add new product controller
export const addNewProductController = async (req, res) => {
  try {
    const { name, price, wcCode, boxCode, ti, hi, upc, description } =
      req.body || {};

    console.log("file", req.file);

    // check validation errors
    const validationErrors = {};

    if (!price) {
      validationErrors.price = "Price is required!!";
    }

    if (!wcCode) {
      validationErrors.wcCode = "WC Code is required!!";
    }

    if (!ti) {
      validationErrors.ti = "TI is required!!";
    }

    if (!hi) {
      validationErrors.hi = "HI is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("name", name);
      req.flash("price", price);
      req.flash("wcCode", wcCode);
      req.flash("boxCode", boxCode);
      req.flash("ti", ti);
      req.flash("hi", hi);
      req.flash("upc", upc);
      req.flash("description", description);
      return res.redirect("/add-product");
    }

    // get the products data
    fs.readFile("data/products.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // Parse JSON data
      const products = JSON.parse(data);

      const updatedProducts = [
        ...products,
        {
          image: `/uploads/${req.file?.filename}`,
          id: uuidv4(),
          name,
          price: Number(price),
          wcCode,
          boxCode,
          ti: Number(ti),
          hi: Number(hi),
          upc,
          description,
        },
      ];

      // add new customer data
      fs.writeFile(
        "data/products.json",
        JSON.stringify(updatedProducts),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing to file");
            return;
          }

          res.redirect("/");
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

// delete product controller
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params || {};

    // get the products data
    fs.readFile("data/products.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // Parse JSON data
      const products = JSON.parse(data);

      const deletedProducts = products?.filter((product) => product?.id !== id);

      // delete product
      fs.writeFile(
        "data/products.json",
        JSON.stringify(deletedProducts),
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
