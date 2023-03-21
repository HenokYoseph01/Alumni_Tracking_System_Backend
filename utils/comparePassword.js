//Requre bcrypt
const bcrypt = require('bcrypt');

//Compare password
const comparePassword = (password,hashedPassword) => {
    return bcrypt.compareSync(password,hashedPassword)
};

//Export the function
module.exports = comparePassword;