const express = require("express");
const usersApi = require("./usersApi");
const loginApi = require("./loginApi");
const router = express.Router();
router.use("/users", usersApi);
router.use("/login", loginApi);
const app = express();
app.use(express.json());

// Montar todas las APIs en /api
app.use("/api", router);

module.exports = app;