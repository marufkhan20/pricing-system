import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import authRoute from "./routes/authRoute.js";
import customerRoute from "./routes/customerRoute.js";
import orderRoute from "./routes/orderRoute.js";
import productRoute from "./routes/productRoute.js";

const app = express();
const port = 8000;

// Middleware to set public folder
app.use(express.static("public"));

config();

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

const saveData = (data, file) => {
  const finished = (error) => {
    if (error) {
      console.error(error);
      return;
    }
    const jsonData = JSON.stringify(data, null, 2);
    FileSystem.writeFile(file, jsonData, finished);
  };
};

app.use("/", orderRoute);

app.use("/", customerRoute);

app.use("/", authRoute);

app.use("/", productRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
