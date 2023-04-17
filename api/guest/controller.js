//Require DAL
const Guest = require('./DAL');

//Require AppError
const AppError = require('../../utils/appError');


exports.getAllEvents = async(req,res,next)=>{
    try {
        //Page
        let page = req.query.page
         if(!page) page = 1;

        //Get all events
        const events = await Guest.getAllEvent((page-1)*5)

        //Response
        res.status(200).json({
            status:"SUCCESS",
            length: events.length,
            data:{events}
        })
    } catch (error) {
        res.status(400).json({
            error:error.message
        })
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
        if(!event) throw Error("Event does not exist")//return next(new AppError('Event does not exist',400));

        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{event}
        })
    } catch (error) {
        res.status(400).json({
            error:error.message
        })
    }
}

//Get minimum data of alumni 
exports.getMinimumAlumniInfo = async(req,res,next)=>{
    try {
        //Get year
        const {year} = req.body;

        if(!year) throw Error('Please provide a year');

        //Get minimum info about alumni
         const alumni = await Guest.getMinimumAlumniInfo(year);


         //Response
         res.status(200).json({
            status:'SUCCESS',
            data:{alumni}
         })
         
    } catch (error) {
        res.status(400).json({
            error:error.message
        })
    }
}