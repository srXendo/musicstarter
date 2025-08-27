const {DOMAIN_FRONT, PORT_FRONT, PROT_FRONT} = require('process').env
module.exports = class cors_middleware{
    set_access_control_allow_origin(req, res, next){
        if(req.headers.origin.indexOf(DOMAIN_FRONT + ':' + PORT_FRONT) > -1){
            res.setHeader('Access-Control-Request-Method', `${req.method}, OPTIONS` )
            res.setHeader('Access-Control-Allow-Origin', this.get_front_url(PROT_FRONT, DOMAIN_FRONT, PORT_FRONT))
            res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin, Host')

            res.setHeader('Content-Type','application/json;charset=UTF-8')
        }
        if(req.method === 'OPTIONS'){
            res.status(204)
        }
        console.log('seteando acceso de control cabeceras')
        next()
    }
    get_front_url(prot, domain, port){
        return `${prot}://${domain}:${port}`
    }
} 