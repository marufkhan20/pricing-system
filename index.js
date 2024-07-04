import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import fs from "fs";
import mongoose from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Customer from "./models/Customer.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import authRoute from "./routes/authRoute.js";
import customerRoute from "./routes/customerRoute.js";
import orderRoute from "./routes/orderRoute.js";
import productRoute from "./routes/productRoute.js";

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
