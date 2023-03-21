//Require DAL
const Head = require('./DAL');

//Require AppError
const AppError = require('../../utils/appError');

//Require comparePassword
const comparePassword = require('../../utils/comparePassword');

//Require createToken
const createToken = require('../../utils/createToken');

//Require write excel
const writeExcel = require('../../utils/writeReport');



exports.login = async(req,res,next)=>{
    try {
        //Get input from body
        const {email,password} = req.body;

        //Check if email or password has been provided
        if(!email||!password) return next(new AppError("Please fill all required fields",400))

        //Get alumni
        const head = await Head.headLogin(email);

       // Check if alumni exists
        if(!head) return next(new AppError('Wrong email or password',400));

        //Get the alumni account
        const account = await Head.getHeadAccount(head.account)
       
        //Check if password is correct
        if(!comparePassword(password.toString(),account.password)) return next(new AppError('Wrong email or password'))

        //Create token
        const headToken = createToken({id: head.id, role:"Head"});

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Successfully logged in",
            data: {
                head
            },
            headToken
        })

    } catch (error) {
        next(error)
    }
}

//Get all Events
exports.getAllEvent = async(req,res,next)=>{
    try {
        //Get all events
        const events = await Head.getAllEvent();
        
        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{events}
        })
    } catch (error) {
        next(error)
    }
}

//Get single Events
exports.getSingleEvent = async(req,res,next)=>{
    try {
        //Get id from params
        const eventId = req.params.eventId
        //Get all events
        const event = await Head.getSingleEvent(eventId);

        //check if event exists
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

//Create Events
exports.createEvent = async(req,res,next)=>{
    try {
        //Check if all fields are filled
        const{
            name,
            category,
            description,
            event_date,
            time_start,
            time_end,
            venue,
            host,
            viewable
        } = req.body

        if(
            !name||!category||!description||!event_date||!time_start||
            !time_end||!venue||!host||!viewable
        ) return next(new AppError('Please fill in required values',400))

        //Create Event
        const event = await Head.createEvent(req.body);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Event created successfully",
            data:{event}
        })
    } catch (error) {
        next(error)
    }
}

//Update Event
exports.updateEvent = async(req,res,next)=>{
    try {
        //Get event id
        const eventId = req.params.eventId;

        //Check if there are any events to delete
        const getEvent = await Head.getSingleEvent(eventId);

        //check if there are any events
        if(!getEvent) return next(new AppError('No Events to update',400));

        //Get data from body
        const data = req.body;
        data.eventId = eventId;

        //update Event
        const event = await Head.updateEvent(data);

        //Response
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Updated Event Successfully',
            data:{event}
        })
    } catch (error) {
        next(error)
    }
}

//delete All Events
exports.deleteAllEvent = async(req,res,next)=>{
    try {
        //Check if there are any events to delete
        const getEvents = await Head.getAllEvent();

        //check if there are any events
        if(getEvents.length===0) return next(new AppError('No Events to delete',400));

        //Delete All Events
        await Head.deleteAllEvent();

        //Response
        res.status(200).json({
            status:'SUCCESS',
            message:'All Events Have Been Deleted'
        })

    } catch (error) {
        next(error)
    }
}

//Delete Single Event
//delete All Events
exports.deleteSingleEvent = async(req,res,next)=>{
    try {
        //Get Event Id
        const eventId = req.params.eventId;

        //Check if there are any events to delete
        const getEvent = await Head.getSingleEvent(eventId);

        //check if there are any events
        if(!getEvent) return next(new AppError('No Events to delete',400));

        //Delete All Events
        await Head.deleteSingleEvent(eventId);

        //Response
        res.status(200).json({
            status:'SUCCESS',
            message:'Event has been deleted'
        })

    } catch (error) {
        next(error)
    }
}

//Get Alumnus
exports.getAlumnus = async(req,res,next)=>{
    try {
        //Get Alumnus
        const alumnus = await Head.getAllAlumnus();

        //Response
        res.status(200).json({
            status:'SUCCESS',
            data:{alumnus}
        })
    } catch (error) {
        next(error)
    }
}

//Generate Report
exports.generateReport = async(req,res,next)=>{
    try {
        //Get data from body
        const{
            batch
        } = req.body

        if(!batch) return next(new AppError('Please provide batch',400))

        //Prepare file name
        const file_name = batch + ` report.xlsx`;

        //Generate the report
        const report = await Head.generateReport(batch);
        const data = {}
        data.report = report;
        data.file_name = file_name;
        
        //Generate Excel file
         await writeExcel(data);

        //Response
        res.status(200).json({
            status: "SUCCESS",
            message: "The report has been successfully created",
            data:{
                report
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.getHeadProfile = async(req,res,next)=>{
    try {
        //Get head id
        const headId = req.user.id;

        //Get head profile
        const head = await Head.getHeadProfile(headId);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{head}
        })
    } catch (error) {
        next(error)
    }
}

exports.findSpecficItem = async(req,res,next)=>{
    try {
        let outcome;
        const categories = req.body.categories
        const search = req.body.search + ':*'

        if(search){
            outcome = await Head.searchAlumni(search)
        }

        //Response
        res.status(200).json({
            status: "SUCCESS",
            data:{outcome}
        })
    } catch (error) {
        next(error)
    }
}

//Update Head
exports.updateHead = async(req,res,next)=>{
    try {
        //Get data for update
        const data = req.body;

        //Get id from req.user
        data.headId = req.user.id;

        //Update Head
        const head = await Head.updateHead(data);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Successfully Updated",
            data:{head}
        })
    } catch (error) {
        next(error)
    }
}