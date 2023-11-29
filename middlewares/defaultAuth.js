const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");

exports.defaultAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return next(new HttpError("No token, Authorization Denied", 400));
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_ACCESSTOKEN_SECRET_KEY);
    if (tokenData) {
      const userDetails = await User.findOne({
        email: tokenData.email,
      });
      if (userDetails) {
        req.userDetails = userDetails;
        next();
      } else {
        return next(new HttpError("User not found, invalid request.", 401));
      }
    } else {
      return next(new HttpError("Unauthorized request, please try again", 401));
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpError("Token is expired.", 401));
    }
    return next(
      new HttpError(error || "Something went wrong, please try again", 500)
    );
  }
};

exports.verifyTokenForAllRoutes = async (req, res, next) => {
  const token = req.body.accessToken;

  if (!token) {
    return next(new HttpError("No token, Authorization Denied", 400));
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_ACCESSTOKEN_SECRET_KEY);
    if (tokenData) {
      res.locals.tokenUserRef = tokenData?.customerReference
        ? tokenData?.customerReference
        : "";
      next();
    } else {
      return next(new HttpError("Unauthorized request, please try again", 401));
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpError("Token is expired.", 401));
    }
    return next(
      new HttpError(error || "Something went wrong, please try again", 500)
    );
  }
};
