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

//Require batch write excel
const writeExcelAll = require('../../utils/writeReportAll')

//For dowloading files
const https = require('https');
const fs = require('fs');
const path = require('path');

//Require multer
const multer = require('multer')

//Require cloundinary
const cloundinary = require('../../utils/cloudinary')



//Get all Events
exports.getAllEvent = async(req,res,next)=>{
    try {
         //Page
         let page = req.query.page
         if(!page) page = 1;
         

        //Get all events
        const events = await Head.getAllEvent((page-1)*5);
        
        //Response
        res.status(200).json({
            status:"SUCCESS",
            length: events.length,
            page,
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
        //Page
        let page = req.query.page
        if(!page) page = 1;
        const pageNum = page
        
        //Get Alumnus
        const alumnus = await Head.getAllAlumnus();

        //Response
        res.status(200).json({
            status:'SUCCESS',
            length: alumnus.length,
            page: pageNum,
            data:{alumnus}
        })
    } catch (error) {
        next(error)
    }
}

//Generate Report
exports.generateReport = async(req,res,next)=>{
    try {
        //Get data from body //Change to id since this is a get endpoint
        const{
            batch
        } = req.body

        console.log(batch)
        //Create container to hold data if user picks all
        const allData = [];
        if(!batch) return next(new AppError('Please provide batch',400))

        //Prepare file name
        const file_name = batch + `_report.xlsx`;
        if(batch === 'all'){
            const batch = await Head.getBatches()
            
            for(const x of batch){
                 allData.push(await Head.generateReport(x.date_of_graduation));
            }

            await writeExcelAll(allData,file_name)
            
            
        }else{
              //Generate the report
            const report = await Head.generateReport(batch);
            const data = {}
            data.report = report;
            data.file_name = file_name;
            
            //Generate Excel file
            await writeExcel(data);
        }
      
        // Upload
        const upload = multer({
            storage: multer.diskStorage({}),
            limits: { fileSize: 5 * 1024 * 1024 }, // File size limit: 5MB
            fileFilter: function (req, file, callBack) {
            checkFileType(req, file, callBack);
            },
        });
        
        //Download the file onto local system
        const pathname = path.join(process.cwd(),`/files/${file_name}`);
        const newFile = file_name.split(".")[0] + ".png";
        const file = await cloundinary.uploader.upload(pathname,{
            folder:"Reports",
            resource_type: 'raw'
        })
        req.pathname = file.secure_url
        next()
    } catch (error) {
        next(error)
    }
}

exports.download = async(req,res,next)=>{
    try {
        console.log(req.pathname)
        res.send(
            req.pathname
            );
    } catch (error) {
        console.log(error.message)
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
        const search = req.query.search + ':*'
         //Page
         let page = req.query.page
         if(!page) page = 1;
         const pageNum = page

        if(search && search!=='undefined:*' && search!==':*'){
            outcome = await Head.searchAlumni(search)
        }else{
            console.log('two')
            outcome = await Head.getAllAlumnus();
        }
            
            

        //Response
        res.status(200).json({
            status: "SUCCESS",
            length: outcome.length,
            page,
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