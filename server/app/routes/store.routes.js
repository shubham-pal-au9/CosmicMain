module.exports = app => {
    const store = require("../controllers/store.controller.js");
    var router = require("express").Router();

    router.post("/getAlldata", store.getAlldata);
    router.post("/buyStoreItem", store.buyStoreItem);
   
      
    app.use('/api/store', router);
  };