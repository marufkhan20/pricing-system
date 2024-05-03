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

      res.render("index.ejs", {
        products: JSON.parse(data),
        path: "products",
        title: "Products",
      });
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
    const {
      price,
      wcCode,
      boxCode,
      ti,
      hi,
      upc,
      description,
      image,
      pack,
      tag1,
      tag2,
    } = req.body || {};

    // check validation errors
    const validationErrors = {};

    if (!description) {
      validationErrors.description = "Description is required!!";
    }

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

    if (!pack) {
      validationErrors.pack = "Pack is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("price", price);
      req.flash("wcCode", wcCode);
      req.flash("boxCode", boxCode);
      req.flash("ti", ti);
      req.flash("hi", hi);
      req.flash("upc", upc);
      req.flash("description", description);
      req.flash("pack", pack);
      req.flash("image", image);
      req.flash("tag1", tag1);
      req.flash("tag2", tag2);
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
          image,
          id: uuidv4(),
          pack: Number(pack),
          price: Number(price),
          wcCode,
          boxCode,
          ti: Number(ti),
          hi: Number(hi),
          upc,
          tag1,
          tag2,
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

// edit product view controller
export const editProductViewController = async (req, res) => {
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

      const product = products?.find((product) => product?.id === id);

      req.flash("price", product?.price);
      req.flash("id", product?.id);
      req.flash("wcCode", product?.wcCode);
      req.flash("boxCode", product?.boxCode);
      req.flash("ti", product?.ti);
      req.flash("hi", product?.hi);
      req.flash("upc", product?.upc);
      req.flash("description", product?.description);
      req.flash("pack", product?.pack);
      req.flash("image", product?.image);
      req.flash("tag1", product?.tag1);
      req.flash("tag2", product?.tag2);
      res.render("edit_product.ejs", {
        path: "products",
        title: "Edit Product",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// edit product controller
export const editProductController = async (req, res) => {
  try {
    const {
      price,
      wcCode,
      boxCode,
      ti,
      hi,
      upc,
      description,
      image,
      pack,
      tag1,
      tag2,
    } = req.body || {};

    const { id } = req.params || {};

    // check validation errors
    const validationErrors = {};

    if (!description) {
      validationErrors.description = "Description is required!!";
    }

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

    if (!pack) {
      validationErrors.pack = "Pack is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("price", price);
      req.flash("wcCode", wcCode);
      req.flash("boxCode", boxCode);
      req.flash("ti", ti);
      req.flash("hi", hi);
      req.flash("upc", upc);
      req.flash("description", description);
      req.flash("pack", pack);
      req.flash("image", image);
      req.flash("tag1", tag1);
      req.flash("tag2", tag2);
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

      const updatedProducts = products?.map((product) => {
        if (product?.id === id) {
          return { ...product, ...req.body };
        } else {
          return product;
        }
      });

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
