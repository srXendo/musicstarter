const {DOMAIN_FRONT, PORT_FRONT, PROT_FRONT} = require('process').env
const c_cors_middleware = require('./middlewares/cors');
const routerApi = require("./routerApi");
const poolLib = require("../libs/pool.lib");
const rooms = []
class HubApi {
    #cors_middleware = new c_cors_middleware() 
    router = new routerApi('/api/hub')

    constructor() {
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.set_route("PUT", "", this.createHub.bind(this));
        this.router.set_route("GET", "", this.getHub.bind(this));
    }
    getHub(stream, headers){
        // Middleware CORS sencillo
        return Promise.resolve([false, 200, rooms])
    }
    createHub(stream, headers) {
        console.log(`cookie: ${headers['cookie']}`)
        rooms.push({
            stream: stream   
        })

        return Promise.resolve([false, 200, {id_room: rooms.length}])
    }
}

module.exports = new HubApi().router;