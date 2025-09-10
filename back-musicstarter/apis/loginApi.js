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

  temporalLogin(stream, headers) {
    console.log(this.pool, headers)
    const {length} = this.pool.get_entities()
    
      // Middleware CORS sencillo
    let response = {
      "content-type": "application/json",
      "access-control-allow-origin": `${PROT_FRONT}://${DOMAIN_FRONT}:${PORT_FRONT}`,
      "access-control-allow-methods": "GET,POST,OPTIONS",
      'Access-Control-Allow-Credentials': true,
      "access-control-allow-headers": "Content-Type, Cookies",
      ":status": 200,
    };

    if(!headers['cookie'] || !~headers['cookie'].indexOf('musicstarterSession=')){
      response['Set-Cookie'] = `musicstarterSession=${length};SameSite=None; Domain=${DOMAIN_FRONT}; HttpOnly; Secure; musicstarterSession2=${length};SameSite=None; Domain=${DOMAIN_FRONT}; HttpOnly; Secure`
      this.pool.set_entity(stream)
    }
    
    stream.respond(response)
    return new loginController().temporalLogin()
  }

  login(req, res){
    const body = req.body;
    console.log(body)
    return new Promise(resolve=>resolve([false, 500, 'login.temporal.no.implement']))
  }
}

module.exports = new LoginApi().router;