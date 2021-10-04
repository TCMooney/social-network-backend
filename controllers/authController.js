const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/userSchema");
const _ = require("lodash");
const { sendEmail } = require("../helpers");

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({ error: "Email address already in use" });

  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Successful Signup" });
};

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please sign up.",
      });
    }
    //if user is not found make sure the email and password match
    // create authenitcation method in model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password does not match",
      });
    }
    //generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the tokens 't' in cookie with expiration date
    res.cookie("auth-token", token, { expire: new Date() + 9999 });
    //return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("auth-token");
  return res.json({ message: "Signout successfully" });
};

exports.requireSignin = expressJwt({
  // if the token is valid, express jwt appends the verified users id in an auth key to the request object
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.forgotPassword = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "No request body" });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: "No email in request body" });
  }

  console.log("forgot password finding user with that email");
  const { email } = req.body;
  console.log(("signin req.body", email));
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status("401")
        .json({ error: "User with that email does not exist" });
    }

    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );

    const emailData = {
      from: "noreply@node-react.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password`,
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  console.log(req.body);
  User.findOne({ resetPasswordLink }, (err, user) => {
    if (err || !user) {
      return res.status("401").json({ error: "Invalid Link!" });
    }

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({ message: `Great! Now you can login with your new password.` });
    });
  });
};

exports.socialLogin = (req, res) => {
  //try signup by finding user with req.email
  let user = User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      user = new User(req.body);
      req.profile = user;
      //generate a token with iser id and secret
      const token = jwt.sign(
        { _id: user._id, iss: "NODEAPI" },
        process.env.JWT_SECRET
      );
      res.cookie("t", token, { expire: new Date() + 9999 });
      //return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, name, email } });
    } else {
      //update existing user with new social info and login
      req.profile = user;
      user = _.extend(user, req.body);
      user.updated = Date.now();
      user.save();
      //generate a token with user id and secret
      const token = jwt.sign(
        { _id: user._id, iss: "NODEAPI" },
        process.env.JWT_SECRET
      );
      res.cookie("t", token, { expire: new Date() + 9999 });
      //return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, name, email } });
    }
  });
};
