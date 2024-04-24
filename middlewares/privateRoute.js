import jwt from "jsonwebtoken";

const privateRoute = (req, res, next) => {
  try {
    const { accessToken } = req.cookies || {};

    if (accessToken) {
      const user = jwt.verify(accessToken, process.env.SECRET_KEY);
      res.locals.user = user;
      next();
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
};

export default privateRoute;
