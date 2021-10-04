exports.createPostValidator = (req, res, next) => {
  //title
  req.check("title", "Write a title").notEmpty();
  req.check("title", "Title must be between 4 and 150 characters").isLength({
    min: 4,
    max: 150,
  });
  //body
  req.check("body", "Write a body").notEmpty();
  req.check("body", "Body must be between 4 and 2000 characters").isLength({
    min: 4,
    max: 2000,
  });
  //check for errors

  const errors = req.validationErrors();
  //if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }
  //proceed to next middleware
  next();
};

exports.userSignupValidator = (req, res, next) => {
  //name is not null and between 4-10 characters
  req.check("name", "Name is required").notEmpty();
  //email is not null, valid is normalized
  req
    .check("email", "Email must be between 3 or 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 2000,
    });
  //check for password
  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain 6 characters")
    .matches(/\d/)
    .withMessage("Must contain a number");
  //check for errors
  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }
  //proceed to next middleware
  next();
};

exports.passwordResetValidator = (req, res, next) => {
  //check for password
  req.check("newPassword", "Password is required").notEmpty();
  req
    .check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("must contain a number");

  //check for errors
  const errors = req.validationErrors();
  //if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  //proceed to next middleware or ...
  next();
};
