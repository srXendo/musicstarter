const express = require("express");

class UsersApi {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get("/", this.getUsers);
    this.router.post("/", this.createUser);
  }

  getUsers(req, res) {
    res.json({ message: "Lista de usuarios" });
  }

  createUser(req, res) {
    const { name } = req.body;
    res.json({ message: `Usuario ${name} creado` });
  }
}

module.exports = new UsersApi().router;