module.exports = app => {
    const wallet = require("../controllers/wallet.controller.js");
    var router = require("express").Router();

    router.post("/getAlldata", wallet.getAlldata);
    router.post("/updateUserLoadout", wallet.updateUserLoadout);
    // router.post("/login", wallet.logIn);
      
    app.use('/api/wallet', router);
  };