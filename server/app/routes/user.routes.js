module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();

  router.post("/register", users.create);
  router.post("/login", users.logIn);
  router.post("/updateSelectedCharacter", users.updateSelectedCharacter);
  router.post("/updateUserDiamond", users.updateUserDiamond);
  router.post("/withdrawTokenBLD", users.withdrawTokenBLD);
  router.post("/forgetPassword", users.forgetPassword);
  router.post("/verifyPassword", users.verifyPassword);

  app.use("/api/users", router);
};
