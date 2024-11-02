import jwt from "jsonwebtoken";
import User from "../models/User.js";

// create new user controller
export const createNewUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // check validation errors
    const validationErrors = {};

    if (!name) {
      validationErrors.name = "Name is required!!";
    }

    if (!email) {
      validationErrors.email = "Email is required!!";
    }

    if (!password) {
      validationErrors.password = "Password is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("name", name);
      req.flash("email", email);
      return res.redirect("/signup");
    }

    const user = new User({ name, email, password });

    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// login user controller
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // check validation errors
    const validationErrors = {};

    if (!email) {
      validationErrors.email = "Email is required!!";
    }

    if (!password) {
      validationErrors.password = "Password is required!!";
    }

    if (Object.keys(validationErrors).length > 0) {
      req.flash("errors", JSON.stringify(validationErrors));
      req.flash("email", email);
      return res.redirect("/login");
    }

    // check availabe user
    const user = await User.findOne({ email, password });

    if (!user) {
      req.flash("email", email);
      req.flash(
        "errors",
        JSON.stringify({
          password: "Email or password is incorrect!!",
        })
      );
      return res.redirect("/login");
    }

    // generate new token
    const accessToken = jwt.sign(
      {
        name: user?.name,
        email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30days" }
    );

    // Set cookie with expiration time
    const expiryDate = new Date();
    // Add 1 year to the current date
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    res.cookie("accessToken", accessToken, {
      expires: expiryDate,
      httpOnly: true, // recommended for security
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// log out controller
export const logoutController = async (req, res) => {
  try {
    res.cookie("accessToken", "", { expires: new Date(0) });
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};
