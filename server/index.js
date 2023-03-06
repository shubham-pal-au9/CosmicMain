
const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "*",
  methods: "GET,POST"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Cosmic Assians" });
});
require("./app/routes/user.routes.js")(app);
require("./app/routes/wallet.routes.js")(app);
require("./app/routes/store.routes.js")(app);
// set port, listen for requests
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});