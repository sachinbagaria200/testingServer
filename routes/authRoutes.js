const express = require("express");
const { check, validationResult } = require("express-validator");

const authControllers = require("../controllers/authControllers");
const { defaultAuth } = require("../middlewares/defaultAuth");
const HttpError = require("../models/http-error");
const router = express.Router();
router.post(
  "/create",
  [
    check("email", "Please Include a Valid Email").isEmail(),
    check("firstName", "Please Enter a Firstname").isString(),
    check("surName", "Please Enter a Surname").isString(),
    check("mobileNo", "Please Enter a Mobile Number")
      .isInt()
      .isLength({ min: 10, max: 10 }),
    check("password", "Please Enter a Password with 8 or more characters")
      .isString()
      .isLength({ min: 8 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 200));
    }
    next();
  },
  authControllers.createUser
);

router.post(
  "/sign-up",
  [
    check("email", "Please Include a Valid Email").isEmail(),
    check("firstName", "Please Enter a Firstname").isString(),
    check("surName", "Please Enter a Surname").isString(),
    check("mobileNo", "Please Enter a Mobile Number")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("Only Decimals allowed"),
    check("password", "Please Enter a Password with 8 or more characters")
      .isString()
      .isLength({ min: 8 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 200));
    }
    next();
  },
  authControllers.signUp
);

router.post(
  "/login",
  [
    check("email", "Please Include a Valid Email").isEmail(),
    check(
      "password",
      "Please Enter a Password with 8 or more characters"
    ).isLength({ min: 8 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 200));
    }
    next();
  },
  authControllers.login
);

router.post("/login-through-token", authControllers.loginThroughToken);

router.post("/get-access-token", authControllers.getAccessToken);

router.post(
  "/add-customer-reference",
  [
    check("email", "Please Include a Valid Email").isEmail(),
    check("customerReference", "Please enter a Customer Reference").notEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 200));
    }
    next();
  },
  authControllers.addCustomerReference
);

router.patch(
  "/update-details",
  defaultAuth,
  authControllers.updateCustomerDetails
);

router.post(
  "/request-for-reset-password",
  [check("email", "Please Include a Valid Email").isEmail()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 200));
    }
    next();
  },
  authControllers.sendEmailForResetPassword
);

router.post(
  "/verify-reset-password-link",
  [check("token", "Please provide token").isString()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 200));
    }
    next();
  },
  authControllers.verifyResetPasswordLink
);

router.post(
  "/reset-password",
  [
    check("email", "Please Include a Valid Email").isEmail(),
    check(
      "password",
      "Please Enter a Password with 8 or more characters"
    ).isLength({ min: 8 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 200));
    }
    next();
  },
  authControllers.resetPassword
);

router.post("/api/SearchCustomers", async (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
