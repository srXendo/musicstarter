const {DOMAIN_FRONT, PORT_FRONT, PROT_FRONT} = require('process').env
const c_cors_middleware = require('./middlewares/cors');
const routerApi = require("./routerApi");
const loginController = require('./../controllers/loginController');
const poolLib = require("../libs/pool.lib");
class LoginApi {
  #cors_middleware = new c_cors_middleware() 
  router = new routerApi('/api/login')
  pool = new poolLib()
  constructor() {
    this.registerRoutes();
  }

  registerRoutes() {

    this.router.set_route("POST", "/temporal", this.temporalLogin.bind(this));
  }

  async temporalLogin(stream, headers) {
    return new loginController().temporalLogin(headers, this.pool, stream)
  }

  login(req, res){
    const body = req.body;
    console.log(body)
    return new Promise(resolve=>resolve([false, 500, 'login.temporal.no.implement']))
  }
}

module.exports = new LoginApi().router;