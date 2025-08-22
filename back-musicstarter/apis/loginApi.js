const express = require("express");

class LoginApi {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {

    this.router.post("/temporal", this.temporalLogin);
  }



  temporalLogin(req, res) {
    const { name } = req.body;
    res.json({ message: `Usuario ${name} creado` });
  }
}

module.exports = new LoginApi().router;