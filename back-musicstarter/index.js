const process = require('process')
try{
    const app = require("./apis/indexApi");

}catch(err){
    console.error(new Error(err))
    console.error(new Error(err.stack))
}