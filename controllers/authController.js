import fs from "fs";
import jwt from "jsonwebtoken";

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

    // const jsonString = JSON.stringify(req.body, null, 2);

    // Write JSON data to a file asynchronously
    // fs.writeFile("data/users.json", jsonString, (err) => {
    //   if (err) {
    //     console.error(err);
    //     res.status(500).send("Error writing to file");
    //     return;
    //   }
    //   console.log("JSON data written to file successfully");
    //   res.send("JSON data written to file successfully");
    // });
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

    // read user data
    fs.readFile("data/users.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      // Parse JSON data
      const users = JSON.parse(data);

      let isUserHave;

      if (users) {
        users.forEach((user) => {
          if (user?.email === email && user.password === password) {
            isUserHave = user;
          }
        });
      }

      if (!isUserHave) {
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
          name: isUserHave?.name,
          email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1m" }
      );

      res.cookie("accessToken", accessToken);

      res.redirect("/");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};
