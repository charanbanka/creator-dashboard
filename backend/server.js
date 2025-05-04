const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("nodeenv").config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use(helmet());

mongoose.connect(DB_URL, () => {
  console.log("Db connected successfully");
  app.listen(process.env.PORT, () => {
    console.log("Server running at port:", PORT);
  });
});
