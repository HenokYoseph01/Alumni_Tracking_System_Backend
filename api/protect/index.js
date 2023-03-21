//Protect route
//This file is here to process the authorization of the user and make use of the token

//Require AppError
const AppError = require('../../utils/appError');

//Verify Token
const verifyToken = require('../../utils/tokenVerification');

//Require Alumni DAL
const Alumni = require('../alumni/DAL');

//Require Admin DAL
const Admin = require('../admin/DAL');

//Require Head DAL
const Head = require('../head/DAL');

//Middleware
const protect = async(req,res,next)=>{
    try{
        //Token
        let token;

        //Get the bearer token from the header
        if(req.headers.authorization
            && req.headers.authorization.split(" ")[0] === "Bearer"){
                token = req.headers.authorization.split(" ")[1];
            }
        
        //Check if there is a token
        if(!token) return next(new AppError("Please Login",400));
        //Decoded data
        const decodedData = verifyToken(token);
        
        //user variable to hold user depending on role
        let user;
        
        if(decodedData.role === "Alumni"){
            //Check if alumni exists
            const alumni = await Alumni.getSingleAlumni(decodedData.id);
            if(!alumni) return next(new AppError("Unkown User",400))
            
            //assign alumni to user variable
            user = alumni;
        }else if(decodedData.role === "Admin"){
            //check if admin exists
            const admin = await Admin.getSingleAdmin(decodedData.id);
            if(!admin) return next(new AppError("Unkown User",400))

            //assign admin to user variable
            user = admin;
        }else if(decodedData.role === "Head"){
            //check if head exists
            const head = await Head.getSingleHead(decodedData.id);
            if(!head) return next(new AppError("Unknown User",400))

            //assign head to user variable
            user = head;
        }
        
        //Check if password has been changed at anytime
        // if(await Alumni.checkPasswordChange())
        
        //Assign user to request
        req.user = user;
        //Move to next middleware
        next();
    }catch(error){
        next(error)
    }
}

//export function
module.exports = protect