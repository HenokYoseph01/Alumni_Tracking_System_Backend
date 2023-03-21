//Token Verification

//require JWT
const jwt = require('jsonwebtoken');

//config
const config = require('../config');

//Verify Token function
const verifyToken = (token)=>{
    const decodedData = jwt.verify(token,config.jwt.secret);
    return decodedData
};

//Export the function
module.exports = verifyToken;