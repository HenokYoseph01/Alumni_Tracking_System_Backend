//Require Login DAL
const Login = require('./DAL')

//Require comparePassword
const comparePassword = require('../../utils/comparePassword');

//Require token creator
const createToken = require('../../utils/createToken')

//Require AppError
const AppError = require('../../utils/appError')

//login for all users based on roles
exports.login = async(req,res,next)=>{
    try {
        //Get input from body
        const {email,password} = req.body;

        //Check if email or password has been provided
        if(!email||!password) throw new Error("Please enter Required Fields");

        //Get alumni
        const user = await Login.userLogin(email);

       // Check if alumni exists
        if(!user) throw new Error("Wrong Credentials");
       
        //Check if password is correct
        if(!comparePassword(password.toString(),user.password)) throw new Error("Wrong Credentials")

        //Create token variable
        let userToken;

        if(user.role === 'alumni'){
            const alumni = await Login.getSingleAlumni(user.id)
            //Create token
            userToken = createToken({id: alumni.id, role:"Alumni"});
        }else if(user.role === 'head'){
            const head = await Login.getSingleHead(user.id)
             //Create token
             userToken = createToken({id:head.id, role:"Head"});
        }else if(user.role === 'admin'){
            const admin = await Login.getSingleAdmin(user.id)
             //Create token
             userToken = createToken({id: admin.id, role:"Admin"});
        }

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Successfully logged in",
            userToken
        })

    } catch (error) {
        res.status(400).json({
            error
        })
    }
}