//Require app
const app = require('./app');

//Require http
const http = require('http');

//Get Port
const PORT = process.env.PORT || 5000;

//Require database connection
const db = require('./db');

//Create igniter function
const igniter = ()=>{
    //Create a server
    const server = http.createServer(app);

    //Listen on server
    server.listen(PORT,()=>{
        console.log(`Server listening on ${PORT}`)
    })

    //Majestic Close
    process.on("SIGINT", () => {
        server.close(() => {
          console.log(`Server is closing`);
          db.end(() => {
            console.log(`DB is closing`);
          });
        });
      });
    
}

module.exports = igniter;