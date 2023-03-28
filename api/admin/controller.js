///Require AppError
const AppError = require('../../utils/appError');

//Require DAL
const Admin = require('./DAL');

//Require Path
const fs = require('fs')

//Require OTP-generaor
const otp = require('otp-generator');

//Require bcrypt
const bcrypt = require('bcrypt');

//Require Excel Reader
const reader = require('../../utils/readExcel');
const pool = require('../../loader/db');

//Admin Controllers

//Create Alumni Account
exports.createAlumniAccount = async(req,res,next)=>{
    try {
        //get uploaded list
        const list = await reader(req.file.path);

        //alumni created
        const alumni_created = [];

        //Loop through graduates and assign account 
       for(i in list){
        const data = {};
        if(i === '0') continue
        for(j in list[i]){
            if(j === '0') continue
            switch(j){
                case '1': data.first_name = list[i][j]; break;
                case '2': data.last_name = list[i][j]; break;
                case '3': data.grandfather_name = list[i][j]; break;
                case '4': data.gender = list[i][j]; break;
                case '5': data.gpa = list[i][j]; break;
                case '6': data.graduation_year = list[i][j]; break;
                case '7': data.email = list[i][j]; break;
                case '8': data.department = list[i][j]; break;
            }
        }
        //create random password for alumni account
        const password = otp.generate(5,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
        console.log(password)
        //store password in data object
        data.password = await bcrypt.hash(password, 8);
        //Create alumni
        const alumni = await Admin.createAlumniAccount(data)
        //Send an email with the credentials and password to the alumni
        /*Code*/
        //Save in alumni_created_tab
        alumni_created.push(alumni)
        
       }
       //Delete file from file path
        fs.unlinkSync(req.file.path)

        //Response
        res.status(200).json({
            success: true,
            message: 'SUCCESSFULLY CREATED THE ACCOUNTS',
            data: {alumni_created}
        })
    } catch (error) {
        next(error)
    }
}


//Create Head Account
exports.createHeadAccount = async(req,res,next)=>{
    try {
        //Get data from body
        const{
            first_name,
            last_name,
            grandfather_name,
            phone_number,
            email,
            department
        }=req.body;

        //Check if all details are provided
        if(!first_name||
            !last_name||
            !grandfather_name||
            !phone_number||
            !email||
            !department) return next(new AppError('Please fill in the required details',400));

        //Generate password
        const password = otp.generate(5,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
        console.log(password)
        //Hash password and store it in body
        req.body.password = await bcrypt.hash(password, 8);

        //Create head
        const head = await Admin.createHeadAccount(req.body);

        //send response
        res.status(200).json({
            success:true,
            message: 'Head account has been created',
            data:{
                head
            }
        })
    } catch (error) {
        next(error)
    }
}

//Create Admin Account
exports.createAdminAccount = async(req,res,next)=>{
    try {
        //Get data from body
        const{
            first_name,
            last_name,
            grandfather_name,
            phone_number,
            email
        }=req.body;

        //Check if all details are provided
        if(!first_name||
            !last_name||
            !grandfather_name||
            !phone_number||
            !email) return next(new AppError('Please fill in the required details',400));

        //Generate password
        const password = otp.generate(5,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
        console.log(password)
        //Hash password and store it in body
        req.body.password = await bcrypt.hash(password, 8);

        //Create head
        const admin = await Admin.createAdminAccount(req.body);

        //send response
        res.status(200).json({
            success:true,
            message: 'Admin account has been created',
            data:{
                admin
            }
        })
    } catch (error) {
        next(error)
    }
}

//Get Admin
exports.getAdmin = async(req,res,next)=>{
    try {
        //Get id from req.user
        const adminId = req.user.id;

        //Get Admin
        const admin = await Admin.getSingleAdmin(adminId);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Successfully logged in",
            data:{admin}
        })
    } catch (error) {
        next(error)
    }
}

//Update Admin
exports.updateAdmin = async(req,res,next)=>{
    try {
        //Get data for update
        const data = req.body;

        //Get id from req.user
        data.adminId = req.user.id;

        //Get Admin
        const admin = await Admin.updateAdmin(data);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Successfully Updated in",
            data:{admin}
        })
    } catch (error) {
        next(error)
    }
}

//Get moderation list
exports.getModerationList = async(req,res,next)=>{
    try {
        //Get moderation list
        const moderation_list = await Admin.getModerationList();

        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{moderation_list}
        })
    } catch (error) {
        next(error)
    }
}

//Get single post from forum
exports.getPost = async(req,res,next)=>{
    try {
        //get id of forum
        const forumId = req.params.forumId;

        //get forum
        const post = await Admin.getSingleForum(forumId)

        if(!post) return next(new AppError('Post does not exist',400));

        //Response
        res.status(200).json({
            status:'SUCCESS',
            data:{
                post
            }
        })

    } catch (error) {
        next(error)
    }
}
//Give warning to alumni
exports.giveWarning = async(req,res,next)=>{
    try {
        //Get alumni Id 
        const alumniId = req.params.alumniId;

        //Check if alumni exists
        const alumni = await Admin.getSingleAlumni(alumniId);

        if(!alumni) return next(new AppError('Alumni does not exist',400));

        console.log(alumni.report_warnings)

        //Check if warning given to alumni is above 3
        if(alumni.report_warnings === 3) return next(new AppError('Alumni cannot recieve any more warnings',400));
        //Issue warning to alumni
        const warning = await Admin.issueWarning(alumniId);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message:"Alumni has been warned"
        })
    } catch (error) {
        next(error)
    }
}

//Ban alumni
exports.banAlumni = async(req,res,next)=>{
    try {
        //Get alumni Id
        const alumniId = req.params.alumniId;
        
         //Check if alumni exists
         const alumni = await Admin.getSingleAlumni(alumniId);

         if(!alumni) return next(new AppError('Alumni does not exist',400));
         
         //Check if alumni has 3 warnings
        if(alumni.report_warnings !== 3) return next(new AppError('Alumni cannot be banned',400));

        //Ban Alumni From forum
        const banAlumni = await Admin.issueBan(alumniId);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message:"Alumni has been banned",
            data:{banAlumni}
        })
    } catch (error) {
        next(error)
    }
}

//Delete alumni post
exports.deletePost = async(req,res,next)=>{
    try {
        //Get the forumId
        const forumId = req.params.forumId;

        //get forum
        const post = await Admin.getSingleForum(forumId)

        if(!post) return next(new AppError('Post does not exist',400));

        //Delete post
         await Admin.deletePost(forumId);

         //Response
         res.status(200).json({
            status:"SUCCESS",
            message:"Successfully deleted forum post",
         })
    } catch (error) {
        next(error)
    }
}