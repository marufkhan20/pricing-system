import { Router } from "express";

const router = Router();

router.get("/customers", async (req, res) => {
  res.render("customers.ejs");
});

router.get("/add-customer", (req, res) => {
  res.render("add_customer.ejs");
});

router.post("/customers", (req, res) => {
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

export default router;
