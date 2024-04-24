import { Router } from "express";
import {
  createNewUserController,
  loginUserController,
} from "../controllers/authController.js";
import publicRoute from "../middlewares/publicRoute.js";

const router = Router();

// sign up routes
router.get("/signup", publicRoute, async (req, res) => {
  res.render("signup.ejs");
});
router.post("/signup", publicRoute, createNewUserController);

// login routes
router.get("/login", publicRoute, async (req, res) => {
  res.render("login.ejs");
});
router.post("/login", publicRoute, loginUserController);

export default router;
