const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User.model.js");

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!",
    });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({
      message: "Password can not be empty!",
    });
    return;
  }

  if (!req.body.confirm_password) {
    res.status(400).send({
      message: "Confirm Password can not be empty!",
    });
    return;
  }
  if (req.body.confirm_password != req.body.password) {
    res.status(400).send({
      message: "Confirm Password dosen't not match!",
    });
    return;
  }
  if (!req.body.user_name) {
    res.status(400).send({
      message: "User Name can not be empty!",
    });
    return;
  }

  if (!req.body.dob) {
    res.status(400).send({
      message: "Date of Birth can not be empty!",
    });
    return;
  }

  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  // Create a User
  const user = new User({
    user_name: req.body.user_name,
    email: req.body.email,
    password: encryptedPassword,
    dob: req.body.dob,
  });
  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    else res.send(data);
  });
};

exports.logIn = async (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({
      message: "Password can not be empty!",
    });
    return;
  }
  User.logIn(req, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `User Not found `,
        });
      } else {
        res.status(500).send({
          message: "Authentication Error",
        });
      }
    } else {
      res.send(data);
    }
  });
};

//updateSelectedCharacter

exports.updateSelectedCharacter = async (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({
      message: "User Id can not be empty!",
    });
    return;
  }
  if (!req.body.item_id) {
    res.status(400).send({
      message: "character id can not be empty!",
    });
    return;
  }
  User.updateSelectedCharacter(req.body, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.send(data);
    }
  });
};

//updateUserDiamond
exports.updateUserDiamond = async (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({
      message: "User Id can not be empty!",
    });
    return;
  }
  if (!req.body.diamond) {
    res.status(400).send({
      message: "diamond can not be empty!",
    });
    return;
  }
  User.updateUserDiamond(req.body, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.send(data);
    }
  });
};

//withdrawTokenBLD
exports.withdrawTokenBLD = async (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({
      message: "User Id can not be empty!",
    });
    return;
  }
  if (!req.body.token_amount) {
    res.status(400).send({
      message: "Token amount can not be empty!",
    });
    return;
  }
  if (!req.body.metamask_address) {
    res.status(400).send({
      message: "diamond can not be empty!",
    });
    return;
  }
  User.withdrawTokenBLD(req.body, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.send(data);
    }
  });
};

//Forget Password
exports.forgetPassword = async (req, res) => {
  // Validate request
  if (!req.body.user_email) {
    res.status(400).send({
      message: "User email can not be empty!",
    });
    return;
  }

  User.forgetPasswordUser(req.body, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.send(data);
    }
  });
};

// verify Password

exports.verifyPassword = async (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!",
    });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({
      message: "Password can not be empty!",
    });
    return;
  }

  if (!req.body.confirm_password) {
    res.status(400).send({
      message: "Confirm Password can not be empty!",
    });
    return;
  }
  if (req.body.confirm_password != req.body.password) {
    res.status(400).send({
      message: "Confirm Password dosen't not match!",
    });
    return;
  }

  if (!req.body.otp) {
    res.status(400).send({
      message: "OTP can not be empty!",
    });
    return;
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    otp: req.body.otp,
  });

  User.verifyPasswordUser(user, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.send(data);
    }
  });
};
