const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../schemas/userSchema");
const HttpError = require("../models/http-error");
const sendEmail = require("../utils/emailMethods");

exports.createUser = async (req, res, next) => {
  const { firstName, surName, mobileNo, password } = req.body;
  const email = req.body?.email ? req.body?.email.toLowerCase() : "";
  try {
    const isEmailExists = await User.findOne({
      email,
    });
    if (isEmailExists) {
      return next(
        new HttpError(
          "Email already exists, please try to create user with another email.",
          409
        )
      );
    }

    var salt = await bcrypt.genSalt(10);
    bcrypt.hash(password, salt, async (err, hashPassword) => {
      if (!err && hashPassword) {
        const createdUser = await User.create({
          email,
          firstName,
          surName,
          mobileNo,
          password: hashPassword,
          customerReference: null,
        });

        if (createdUser) {
          return res.status(200).json({ user: createdUser, status: true });
        }
      } else {
        return next(
          new HttpError("Something went wrong, please try again.", 500)
        );
      }
    });
  } catch (error) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.signUp = async (req, res, next) => {
  const { firstName, surName, mobileNo, password, customerReference } =
    req.body;
  const email = req.body?.email.toLowerCase();

  const finalCustomerReference =
    customerReference !== undefined ? customerReference : null;

  try {
    const isEmailExists = await User.findOne({
      email,
    });
    if (isEmailExists) {
      return next(
        new HttpError(
          "Email already exists, please try to create a user with another email.",
          403
        )
      );
    }

    var salt = await bcrypt.genSalt(10);
    bcrypt.hash(password, salt, async (err, hashPassword) => {
      if (!err && hashPassword) {
        const createdUser = await User.create({
          email,
          firstName,
          surName,
          mobileNo,
          password: hashPassword,
          customerReference: finalCustomerReference,
        });

        if (createdUser) {
          const accessToken = jwt.sign(
            {
              email,
              firstName,
              surName,
              mobileNo,
              customerReference: finalCustomerReference,
            },
            process.env.JWT_ACCESSTOKEN_SECRET_KEY,
            {
              expiresIn: "100d",
            }
          );

          const refreshToken = jwt.sign(
            { email },
            process.env.JWT_REFRESHTOKEN_SECRET_KEY,
            {
              expiresIn: "100d",
            }
          );

          if (!accessToken || !refreshToken) {
            return next(
              new HttpError("Something went wrong, please try again.", 500)
            );
          }

          if (accessToken && refreshToken) {
            return res.status(200).json({
              user: {
                email,
                firstName,
                surName,
                mobileNo,
                customerReference: finalCustomerReference,
              },
              accessToken,
              refreshToken,
              status: true,
            });
          }
        }
      } else {
        return next(
          new HttpError("Something went wrong, please try again.", 500)
        );
      }
    });
  } catch (error) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.login = async (req, res, next) => {
  const { password } = req.body;
  const email = req.body?.email.toLowerCase();

  try {
    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return next(
        new HttpError(
          "Invalid email address, please enter correct email address.",
          401
        )
      );
    }
    const isMatched = await bcrypt.compare(password, isUserExists.password);
    if (!isMatched) {
      return next(
        new HttpError("Invalid password, please enter correct password.", 401)
      );
    }
    const accessToken = jwt.sign(
      {
        email,
        firstName: isUserExists.firstName,
        surName: isUserExists.surName,
        mobileNo: isUserExists.mobileNo,
        customerReference: isUserExists.customerReference,
      },
      process.env.JWT_ACCESSTOKEN_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { email },
      process.env.JWT_REFRESHTOKEN_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    if (!accessToken || !refreshToken) {
      return next(
        new HttpError("Something went wrong, please try again.", 500)
      );
    }

    if (accessToken && refreshToken) {
      return res.status(200).json({
        user: {
          email: isUserExists.email,
          firstName: isUserExists.firstName,
          surName: isUserExists.surName,
          mobileNo: isUserExists.mobileNo,
          customerReference: isUserExists.customerReference,
        },
        accessToken,
        refreshToken,
        status: true,
      });
    }
  } catch (error) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.loginThroughToken = async (req, res, next) => {
  const postData = req.body;
  try {
    const tokenData = jwt.verify(
      postData.accessToken,
      process.env.JWT_ACCESSTOKEN_SECRET_KEY
    );
    if (tokenData) {
      const userDetails = await User.findOne({
        email: tokenData.email,
      });
      if (userDetails) {
        return res.status(200).json({ status: true });
      } else {
        return next(new HttpError("User not found, invalid request.", 401));
      }
    } else {
      return next(new HttpError("Invalid request.", 401));
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpError("Token is expired.", 401));
    }
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.getAccessToken = async (req, res, next) => {
  const postData = req.body;
  try {
    const tokenData = jwt.verify(
      postData.refreshToken,
      process.env.JWT_REFRESHTOKEN_SECRET_KEY
    );
    if (tokenData) {
      const userDetails = await User.findOne({ email: tokenData.email });
      if (userDetails) {
        const accessToken = jwt.sign(
          {
            email: userDetails.email,
            firstName: userDetails.firstName,
            surName: userDetails.surName,
            mobileNo: userDetails.mobileNo,
            customerReference: userDetails.customerReference,
          },
          process.env.JWT_ACCESSTOKEN_SECRET_KEY,
          { expiresIn: "1h" }
        );
        return res.status(200).json({ accessToken, status: true });
      } else {
        return next(new HttpError("User not found, invalid request.", 401));
      }
    } else {
      return next(new HttpError("Invalid request.", 401));
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpError("Refresh Token is expired.", 401));
    }
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.addCustomerReference = async (req, res, next) => {
  const { customerReference, email } = req?.body;
  try {
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      if (isEmailExists?.customerReference !== customerReference) {
        await User.findOneAndUpdate(
          { email },
          { customerReference: customerReference }
        );
        return res.status(200).json({
          message: "Customer Reference has been added",
          status: true,
          customerReference,
        });
      } else {
        return next(
          new HttpError("Provided Customer Reference already exists.", 403)
        );
      }
    } else {
      return next(new HttpError("User not found, invalid request.", 401));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.updateCustomerDetails = async (req, res, next) => {
  const { password = "" } = req?.body;
  const email = req.body?.email ? req.body?.email.toLowerCase() : "";
  const userDetails = req?.userDetails;

  try {
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        return next(
          new HttpError(
            "Email address already exist, please try another one.",
            400
          )
        );
      }
    }

    if (userDetails) {
      if (password) {
        if (password?.length < 8)
          return next(
            new HttpError(
              "Please Enter a Password with 8 or more characters",
              400
            )
          );
        const isMatched = await bcrypt.compare(password, userDetails.password);
        if (isMatched) {
          return next(
            new HttpError(
              "Entered password is same as previous password, please try new password",
              400
            )
          );
        }
        var salt = await bcrypt.genSalt(10);
        bcrypt.hash(password, salt, async (err, hashPassword) => {
          if (!err && hashPassword) {
            const newDetails = email
              ? { email, password: hashPassword }
              : { password: hashPassword };
            const response = await User.findOneAndUpdate(
              { email: userDetails?.email },
              newDetails
            );
            const accessToken = jwt.sign(
              {
                email: newDetails?.email || userDetails?.email,
                firstName: userDetails?.firstName,
                surName: userDetails?.surName,
                mobileNo: userDetails?.mobileNo,
                customerReference: userDetails?.customerReference,
              },
              process.env.JWT_ACCESSTOKEN_SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );

            const refreshToken = jwt.sign(
              { email: newDetails?.email || userDetails?.email },
              process.env.JWT_REFRESHTOKEN_SECRET_KEY,
              {
                expiresIn: "7d",
              }
            );

            if (!accessToken || !refreshToken) {
              return next(
                new HttpError("Something went wrong, please try again.", 500)
              );
            }

            if (accessToken && refreshToken && response) {
              return res.status(200).json({
                user: {
                  email: newDetails?.email || userDetails?.email,
                  firstName: userDetails?.firstName,
                  surName: userDetails?.surName,
                  mobileNo: userDetails?.mobileNo,
                  customerReference: userDetails?.customerReference,
                },
                accessToken,
                refreshToken,
                status: true,
              });
            } else {
              return next(new HttpError("Bad request", 400));
            }
          }
        });
      } else {
        if (email) {
          const newDetails = { email };
          const response = await User.findOneAndUpdate(
            { email: userDetails?.email },
            newDetails,
            { new: true }
          );
          const accessToken = jwt.sign(
            {
              email: newDetails?.email,
              firstName: userDetails.firstName,
              surName: userDetails.surName,
              mobileNo: userDetails.mobileNo,
              customerReference: userDetails.customerReference,
            },
            process.env.JWT_ACCESSTOKEN_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );

          const refreshToken = jwt.sign(
            { email: newDetails?.email },
            process.env.JWT_REFRESHTOKEN_SECRET_KEY,
            {
              expiresIn: "7d",
            }
          );

          if (!accessToken || !refreshToken) {
            return next(
              new HttpError("Something went wrong, please try again.", 500)
            );
          }

          if (accessToken && refreshToken && response) {
            return res.status(200).json({
              user: {
                email: newDetails?.email,
                firstName: userDetails.firstName,
                surName: userDetails.surName,
                mobileNo: userDetails.mobileNo,
                customerReference: userDetails.customerReference,
              },
              accessToken,
              refreshToken,
              status: true,
            });
          } else {
            return next(new HttpError("Bad request", 400));
          }
        }
      }
    } else {
      return next(new HttpError("User not found, invalid request.", 401));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.sendEmailForResetPassword = async (req, res, next) => {
  const email = req.body?.email ? req.body?.email.toLowerCase() : "";
  const domain = req.headers.origin;
  try {
    const userDetails = await User.findOne({ email });
    if (userDetails) {
      const token = jwt.sign(
        { email },
        process.env.JWT_TOKEN_FOR_EMAIL_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      let resetPasswordLink = domain + "/reset-password?id=" + token;
      sendEmail({
        subject: "Reset Password Link",
        to: email,
        from: process.env.EMAIL,
        html: `<div style="display:flex;flex-direction:column;">
        <h1><a href="${resetPasswordLink}">Click here</a> to reset your password</h1>
        </div>`,
      });

      return res.status(200).json({
        message: "A link for reseting password has been send to your email.",
        status: true,
      });
    } else {
      return next(new HttpError("User not found, invalid request.", 401));
    }
  } catch (error) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};

exports.verifyResetPasswordLink = async (req, res, next) => {
  const { token } = req.body;
  try {
    const tokenData = jwt.verify(
      token,
      process.env.JWT_TOKEN_FOR_EMAIL_SECRET_KEY
    );
    if (tokenData) {
      const isUserExist = await User.findOne({ email: tokenData?.email });
      if (!isUserExist) {
        return next(
          new HttpError("Invalid request, please provide correct email.", 401)
        );
      }
      if (isUserExist) {
        return res.status(200).json({
          message: "Link is verified.",
          email: tokenData?.email,
          status: true,
        });
      }
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError)
      return next(new HttpError("Token is expired.", 401));
    return next(
      new HttpError("Something went wrong, please try again....", 500)
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email = "", password = "" } = req?.body;
  try {
    const userDetails = await User.findOne({ email });
    if (userDetails) {
      if (password) {
        const isMatched = await bcrypt.compare(password, userDetails.password);
        if (isMatched) {
          return next(
            new HttpError(
              "Entered password is same as previous password, please try new password",
              400
            )
          );
        }
        var salt = await bcrypt.genSalt(10);
        bcrypt.hash(password, salt, async (err, hashPassword) => {
          if (!err && hashPassword) {
            const newDetails = { password: hashPassword };
            const response = await User.findOneAndUpdate(
              { email: userDetails?.email },
              newDetails
            );

            if (response) {
              return res.status(200).json({
                message: "Password is changed successfully",
                status: true,
              });
            } else {
              return next(
                new HttpError("Something went wrong, please try again.", 500)
              );
            }
          }
        });
      }
    } else {
      return next(new HttpError("User not found, invalid request.", 401));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
};
