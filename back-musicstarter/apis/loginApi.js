const express = require("express");
const c_cors_middleware = require('./middlewares/cors');
const routerApi = require("./routerApi");
class LoginApi {
  #cors_middleware = new c_cors_middleware() 
  router = new routerApi('/api/login')
  constructor() {
    this.registerRoutes();
  }

  registerRoutes() {

    this.router.set_route("POST", "/temporal", this.temporalLogin);
  }

  temporalLogin() {
    return new Promise(resolve=>resolve([false, 500, 'login.temporal.no.implement']))
  }

  login(req, res){
    const body = req.body;
    console.log(body)
    return new Promise(resolve=>resolve([false, 500, 'login.temporal.no.implement']))
  }
}

module.exports = new LoginApi().router;