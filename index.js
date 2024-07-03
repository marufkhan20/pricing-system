import { exec } from "child_process";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import mongoose from "mongoose";
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

app.get("/backup", (req, res) => {
  const command = `mongodump --uri="${process.env.MONGODB_CONNECT}" --archive --gzip`;

  exec(command, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
    // Increase buffer size if needed
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send("Backup failed");
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    res.setHeader("Content-Disposition", "attachment; filename=backup.gz");
    res.setHeader("Content-Type", "application/gzip");
    res.send(stdout);
  });
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
