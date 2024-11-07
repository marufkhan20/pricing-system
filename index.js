import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import fs from "fs";
import mongoose from "mongoose";
import cron from "node-cron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Customer from "./models/Customer.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import authRoute from "./routes/authRoute.js";
import customerRoute from "./routes/customerRoute.js";
import orderRoute from "./routes/orderRoute.js";
import productRoute from "./routes/productRoute.js";
import { formatInventoryNumber, readCSVFile } from "./utils/index.js";

const app = express();
const port = 8000;

// Middleware to set public folder
app.use(express.static("public"));

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "s3Cur3",
    name: "sessionId",
    saveUninitialized: false,
    resave: true,
  })
);
app.use(flash());

app.use("/", orderRoute);

app.use("/", customerRoute);

app.use("/", authRoute);

app.use("/", productRoute);

app.post("/update-products", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "product-data/invAvail.csv"); // Path to the CSV file

    // Check if the file exists before proceeding
    if (!fs.existsSync(filePath)) {
      console.log("File not found, skipping update tasks.");
      return; // Exit if the file does not exist
    }

    const data = await readCSVFile(filePath); // Read the CSV file
    const orders = await Order.find(); // Fetch all orders

    // reset products availableInventory data
    await Product.updateMany({}, { availableInventory: 0 });

    // reset order products availableInventory data
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const products = order.products;

      for (let j = 0; j < products.length; j++) {
        const product = products[j];
        product.availableInventory = "";
      }
    }

    const result = Object.values(
      data.reduce((acc, item) => {
        if (acc[item.Part]) {
          acc[item.Part].qty += Number(item.Available); // Add to existing qty
        } else {
          acc[item.Part] = {
            partNumber: item.Part,
            qty: Number(item.Available), // Initialize qty
            uom: item.UOM, // Set uom
          };
        }
        return acc;
      }, {})
    );

    for (const item of result) {
      // update product
      await Product.findOneAndUpdate(
        { wcCode: item?.partNumber },
        {
          $set: {
            uom: item?.uom,
            availableInventory: formatInventoryNumber(item?.qty),
          },
        },
        { new: true } // Return the updated document
      );

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i]; // Current order
        const products = order.products;

        for (let j = 0; j < products.length; j++) {
          const product = products[j];

          // console.log("wc code", product?.wcCode);
          // console.log("partNumber", product?.partNumber);

          if (product?.wcCode === item?.partNumber) {
            console.log("working");
            product.uom = item?.uom;
            product.availableInventory = formatInventoryNumber(item?.qty);
          }
        }

        // Save the updated order
        await Order.findByIdAndUpdate(order?.id, { $set: { products } });
      }
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).json({ error: "Failed to update products" });
  }
});

cron.schedule("*/1 * * * *", async () => {
  console.log("Running scheduled task every hour at 15 after");

  try {
    const filePath = path.join(__dirname, "product-data/invAvail.csv"); // Path to the CSV file

    // Check if the file exists before proceeding
    if (!fs.existsSync(filePath)) {
      console.log("File not found, skipping update tasks.");
      return; // Exit if the file does not exist
    }

    const data = await readCSVFile(filePath); // Read the CSV file
    const orders = await Order.find(); // Fetch all orders

    // reset products availableInventory data
    await Product.updateMany({}, { availableInventory: 0 });

    // reset order products availableInventory data
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const products = order.products;

      for (let j = 0; j < products.length; j++) {
        const product = products[j];
        product.availableInventory = "";
      }
    }

    const result = Object.values(
      data.reduce((acc, item) => {
        if (acc[item.Part]) {
          acc[item.Part].qty += Number(item.Available); // Add to existing qty
        } else {
          acc[item.Part] = {
            partNumber: item.Part,
            qty: Number(item.Available), // Initialize qty
            uom: item.UOM, // Set uom
          };
        }
        return acc;
      }, {})
    );

    for (const item of result) {
      // update product
      await Product.findOneAndUpdate(
        { wcCode: item?.partNumber },
        {
          $set: {
            uom: item?.uom,
            availableInventory: formatInventoryNumber(item?.qty),
          },
        },
        { new: true } // Return the updated document
      );

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i]; // Current order
        const products = order.products;

        for (let j = 0; j < products.length; j++) {
          const product = products[j];

          // console.log("wc code", product?.wcCode);
          // console.log("partNumber", product?.partNumber);

          if (product?.wcCode === item?.partNumber) {
            // console.log("working");
            product.uom = item?.uom;
            product.availableInventory = formatInventoryNumber(item?.qty);
          }
        }

        // Save the updated order
        await Order.findByIdAndUpdate(order?.id, { $set: { products } });
      }
    }
  } catch (error) {
    console.error("Error updating products:", error);
  }
});

app.use("/settings", (req, res) => {
  res.render("settings.ejs", {
    path: "settings",
    title: "Settings",
  });
});

app.get("/backup", async (req, res) => {
  try {
    const customers = await Customer.find().lean().exec();
    const orders = await Order.find().lean().exec();
    const products = await Product.find().lean().exec();

    const jsonData = { customers, orders, products };

    console.log("jsonData", jsonData);

    const jsonString = JSON.stringify(jsonData, null, 2);

    const filePath = path.join(__dirname, "data.json");
    fs.writeFileSync(filePath, jsonString);

    res.download(filePath, "data.json", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Error downloading the file");
      }
      fs.unlinkSync(filePath); // delete file after download
    });
  } catch (error) {
    console.log("error", error);
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
