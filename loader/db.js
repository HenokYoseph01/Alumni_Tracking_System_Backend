//Require pg
const {Pool} = require('pg');

//Require configs
const config = require('../config')

//Set up pg
const pool = new Pool({
    connectionString: config.db.connection_string,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

//Handle all connecton events
pool.on("connect", () => {
    console.log(`DB connected`);
  });
  
  pool.on("acquire", () => {
    console.log(`Client checked out from pool`);
  });
  
  pool.on("remove", () => {
    console.log("Client is removed and closed from the pool");
  });
  
  pool.on("error", (err) => {
    console.log("ERROR");
    console.log(err);
  });
  
  // Export pool
  module.exports = pool;