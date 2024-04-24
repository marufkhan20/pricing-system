import jwt from "jsonwebtoken";

const publicRoute = (req, res, next) => {
  try {
    const { accessToken } = req.cookies || {};

    if (accessToken) {
      const user = jwt.verify(accessToken, process.env.SECRET_KEY);
      res.locals.user = user;
      res.redirect("/");
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

export default publicRoute;
