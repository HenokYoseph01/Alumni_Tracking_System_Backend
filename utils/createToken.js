//Require JWT
const jwt = require("jsonwebtoken");

//Require config
const config = require('../config')

//Create token function
const createToken = (payload) =>{
    //Assign values
    let values = {id:payload.id, role:payload.role};
    
    //Create token
    const token = jwt.sign(
        values,
        config.jwt.secret,
        {
            expiresIn: config.jwt.expires_in
        }
    );

    //return token
    return token;
}

//export token creating function
module.exports = createToken;