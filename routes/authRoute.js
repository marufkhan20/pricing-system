import { Router } from "express";
import {
  createNewUserController,
  loginUserController,
  logoutController,
} from "../controllers/authController.js";
import privateRoute from "../middlewares/privateRoute.js";
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

router.get("/logout", privateRoute, logoutController);

export default router;
