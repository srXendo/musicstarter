module.exports = class loginController{
    temporalLogin(headers, pool, stream){
        const {length} = pool.get_entities()
    
      // Middleware CORS sencillo


        if(!headers['cookie'] || !~headers['cookie'].indexOf('musicstarterSession=')){
            pool.set_entity(stream)
            return Promise.resolve([false, 204, '', length])
        }else{
            return Promise.resolve([false, 204, ''])
        }
        
    }
}