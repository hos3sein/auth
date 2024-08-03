const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    const check = await User.findById(decoded._id);
    // console.log(",,,,,,,,,,,,,,,,,,,", decoded);

    if (check) {
      req.user = decoded;
      next();
    } else {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// !in dorost nist
// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // console.log("req.user.roleModel", req.user.roleModel <= 5);
    if (req.user && req.user.roleModel <= 5) {
      if (!roles.includes(req.user.roleModel)) {
        return next(
          new ErrorResponse(
            `User role ${req.user.roleModel} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    }
    if (req.user && req.user.role <= 5) {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            `admin role ${req.admin.role} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    }
  };
};
