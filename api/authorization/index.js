const AppError = require('../../utils/appError')

//Authorize route
 const authorize = (...roles)=>{ 
    return(req,res,next)=>{
        //checks in logged in user's role is specfied to authroized roles put in the route
        if(!roles.includes(req.user.role)){
            return next(new AppError('This user is not authorized',400))
        }
        next();
    }
}

module.exports = authorize