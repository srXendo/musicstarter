const http2 = require("http2")
const fs = require('fs')
const server = http2.createSecureServer(
  {
    key: fs.readFileSync("server.key"),   // tu clave privada
    cert: fs.readFileSync("server.crt"), // tu certificado
    allowHTTP1: true, // opcional: permite compatibilidad con HTTP/1.1
  },
);
try{
const loginApi = require("./loginApi");
const routes = [ ...loginApi.get_routes()]
server.on("stream", async(stream, headers) => {
  const method = headers[":method"];
  const path = headers[":path"];
  console.log('request on', path, method)
  // Middleware CORS sencillo
  let response = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "Content-Type",
    ":status": 404,
  };

  // OPTIONS preflight
  if (method === "OPTIONS") {
    response[':status'] = 204
    stream.respond(response)
    stream.end();
    return;
  }
  for(let row_route_api of routes){
    if(row_route_api.method === method && row_route_api.path === path){
      const [is_error_response, status_response, message_response] = await row_route_api.funct()
      if(is_error_response){
        console.error(new Error(message_response))
      }
      response[':status'] = status_response
      stream.respond(response)
      stream.end();
      return
    }
  }

});
server.on('error', (err)=>{
  console.error(new Error(err.stack))
  console.error(new Error(err))
})


const PORT = process.env.API_PORT_BACK || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
}catch(err){
  console.error(new Error(err.stack))
  console.error(new Error(err))
}

module.exports = server;