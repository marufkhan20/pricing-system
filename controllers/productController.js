import xlsx from "xlsx";
import Product from "../models/Product.js";

// get all products controller
export const getAllProductController = async (req, res) => {
  try {
    // get all products
    const products = await Product.find();
    res.render("index.ejs", {
      products,
      path: "products",
      title: "Products",
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

    // add new product
    const newProduct = new Product({
      image,
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
    });

    await newProduct.save();
    res.redirect("/");
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

    // get the product
    const product = await Product.findById(id);
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

    // update product
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      $set: {
        image,
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
    });

    if (updatedProduct) {
      res.redirect("/");
    }
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

    // delete product
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// import products Controller
export const importProductsController = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  const propertyMapping = {
    "Tag 1": "tag1",
    "Tag 2": "tag2",
    Image: "image",
    Description: "description",
    "WC Code": "wcCode",
    "Box Code": "boxCode",
    Pack: "pack",
    Unit: "unit",
    Case: "case",
    Ti: "ti",
    Hi: "hi",
    "Case Per Pallet": "casePerPallet",
    UPC: "upc",
    "Freight Per Unit": "freightPerUnit",
    "Freight Per Case": "freightPerCase",
    "Commission 1 Per Unit": "commission1PerUnit",
    "Commission 1 Per Case": "commission1PerCase",
    "Commission 2 Per Unit": "commission2PerUnit",
    "Commission 2 Per Case": "commission2PerCase",
    "Mark Up Unit": "markUpUnit",
    "Mark Up Case": "markUpCase",
  };

  const transformedData = data.map((item) => {
    const newItem = {};
    for (const key in item) {
      newItem[propertyMapping[key?.trim()] || key?.trim()] = item[key?.trim()];
    }
    return newItem;
  });

  transformedData.forEach(async (item) => {
    const newProduct = new Product({
      image: item?.image,
      pack: item?.pack,
      price: Number(item?.unit?.replace("$ ", "")),
      wcCode: item?.wcCode,
      boxCode: item?.boxCode,
      ti: item?.ti,
      hi: item?.hi,
      upc: item?.upc,
      tag1: item?.tag1,
      tag2: item?.tag2,
      description: item?.description,
    });

    await newProduct.save();
  });

  res.redirect("/");
};
