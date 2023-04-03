//Require DAL
const Guest = require('./DAL');

//Require AppError
const AppError = require('../../utils/appError');


exports.getAllEvents = async(req,res,next)=>{
    try {
        //Get all events
        const events = await Guest.getAllEvent()

        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{events}
        })
    } catch (error) {
        next(error)
    }
}

//Get Single Events
exports.getSingleEvent = async(req,res,next)=>{
    try {
        //Get id 
        const eventId = req.params.eventId;

        //Get all events
        const event = await Guest.getSingleEvent(eventId)

        //Check if event exists
        if(!event) return next(new AppError('Event does not exist',400));

        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{event}
        })
    } catch (error) {
        next(error)
    }
}

//Get minimum data of alumni 
exports.getMinimumAlumniInfo = async(req,res,next)=>{
    try {
        //Get minimum info about alumni
         const alumni = await Guest.getMinimumAlumniInfo();

         //Response
         res.status(200).json({
            status:'SUCCESS',
            data:{alumni}
         })
         
    } catch (error) {
        next(error)
    }
}