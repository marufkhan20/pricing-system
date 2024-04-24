import express from "express";

const app = express();
const port = 8000;

let customers = [];
let products = [];

// Middleware to set public folder
app.use(express.static("public"));

// Middleware to parse form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", async (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", async (req, res) => {
  res.render("signup.ejs");
});

app.get("/customers", async (req, res) => {
  res.render("customers.ejs");
});

app.get("/order", (req, res) => {
  res.render("order.ejs");
});

app.get("/add-customer", (req, res) => {
  res.render("add_customer.ejs");
});

app.post("/customers", (req, res) => {
  customerName = req.body["name"];
  freightRate = req.body["freightRate"];
  markUp = req.body["markUp"];
  res.render("customers.ejs", {
    data: {
      name: customerName,
      freight: freightRate,
      mark: markUp,
    },
  });
});

app.get("/add-product", (req, res) => {
  res.render("add_product.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
