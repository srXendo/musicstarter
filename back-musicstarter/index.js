const process = require('process')
try{
    const app = require("./apis/indexApi");

    const PORT = process.env.API_PORT_BACK || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}catch(err){
    console.error(new Error(err))
    console.error(new Error(err.stack))
}