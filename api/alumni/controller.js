//Require DAL
const Alumni = require('./DAL');

//Require AppError
const AppError = require('../../utils/appError');

//Require comparePassword
const comparePassword = require('../../utils/comparePassword');

//Require createToken
const createToken = require('../../utils/createToken');

//Pool
const pool = require('../../loader/db')

//Require Cloudinary
const cloudinary = require('../../utils/cloudinary');

//Require fs
const fs = require('fs');

//Require Bycrpt
const bcrypt = require('bcrypt')

//Alumni Controllers

//Register Alumni
exports.register = async(req,res,next)=>{
    try {
        //Get data from body
        const {
            first_name,
            last_name,
            grandfather_name,
            phone_number1,
            phone_number_alt,
            nationality,
            city,
            subcity,
            woreda,
            kebele,
            region,
            house_no,
            linkedIn,
            occupation,
            workname,
            date_of_graduation,
            category_of_work,
            salary,
            satisfaction,
            attainment
            } = req.body

            //Check if data is provided
            if(
                !phone_number1||
                !nationality||
                !city||
                !subcity||
                !woreda||
                !kebele||
                !region||
                !house_no||
                !occupation||
                !workname||
                !salary||
                !attainment||
                !category_of_work||
                !satisfaction
                ) return next(new AppError('Please provide needed data',400))

               if(req.user.registered) return next(new AppError('You have already registered',400));
                //data variable to hold all data
                const data = req.body;
                data.alumniId = req.user.id

                //call DAL
                const register = await Alumni.register(data);

                //Get alumni photo
                const picture = req.file.path;

                req.data = {
                    register,
                    picture
                }
             
            //Move to next middleware
              next();
    } catch (error) {
        next(error)
    }
}

exports.uploadPhoto = async(req,res,next)=>{
    try {
        
        //Upload file to cloudinary
        cloudinary.uploader.upload(req.data.picture,{folder:`Alumni/${req.data.register.date_of_graduation}`})
        .then(result=>{
            const text = 
            `UPDATE alumni SET
             photo_url = COALESCE($1,photo_url),
             photo_public_id = COALESCE($2, photo_public_id)
             WHERE id = $3 RETURNING *
            `
            pool.query({
                name:'uploadPhoto',
                text,
                values:[result.secure_url,result.public_id,req.data.register.id]
            }).then(data => {
                const register = data.rows[0]

                //Delete photo from file
                fs.unlinkSync(req.data.picture)
                
                 //Send response
                res.status(200).json({
                success:true,
                message: 'Successfully Registered',
                data:{register}
                })
            }).catch(err=>{return next(new AppError('Issue with registration',400))})
          
            
        }).catch(err=>{return next(new AppError('Problem with uploading picture',500))})
        
    } catch (error) {
        next(error)
    }
}

exports.login = async(req,res,next)=>{
    try {
        //Get input from body
        const {email,password} = req.body;

        //Check if email or password has been provided
        if(!email||!password) return next(new AppError("Please fill all required fields",400))

        //Get alumni
        const alumni = await Alumni.alumniLogin(email);

       // Check if alumni exists
        if(!alumni) return next(new AppError('Wrong email or password',400));

        //Get the alumni account
        const account = await Alumni.getAlumiAccount(alumni.account)
       
        //Check if password is correct
        if(!comparePassword(password.toString(),account.password)) return next(new AppError('Wrong email or password'))

        //Create token
        const alumniToken = createToken({id: alumni.id, role:"Alumni"});

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Successfully logged in",
            data: {
                alumni
            },
            alumniToken
        })

    } catch (error) {
        next(error)
    }
}

//Create Forum
exports.createForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));
        
        //Get data from body
        const data = req.body;

        //Check if all fields are provide
        if(!data.title||!data.description) return next(new AppError("Please fill in require values",400));

        //Get authors name from req.user
        data.author = req.user.first_name + ' ' + req.user.last_name;

        //Provide authors id
        data.id = req.user.id;

        //Create the forum
        const forum = await Alumni.createForum(data);

        //Response
        res.status(200).json({
            status: "SUCCESS",
            message: "Successfully created post",
            data:{forum}
        })
    } catch (error) {
        next(error)
    }
}

//Get all forum
exports.getAllForum = async(req,res,next)=>{
    try {
        
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get all forum
        const forums = await Alumni.getAllForum();

        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{forums}
        })
    } catch (error) {
        next(error)
    }
}

//Get author's post 
exports.getAuthorForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get author forum
        const forums = await Alumni.getAuthorForum(req.user.id);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            data:{forums}
        })
    } catch (error) {
        next(error)
    }
}

//Update Forum post
exports.updateForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;
        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

        //Check if post exists
        if(!check) return next(new AppError('Post does not exist',400));
        //Check if user is actual author of post
        if(check.author_id !== req.user.id) return next(new AppError('Unauthorized access',400));

        //get data from body
        const data = req.body

        //Assign forum id to data object
        data.id = forumId

        //Update Forum
        const forum = await Alumni.updateForum(data);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: 'Post has been successfully updated',
            data:{forum}
        })
    } catch (error) {
        next(error)
    }
}

//Delete Forum post
exports.deleteForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;
        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

        //Check if post exists
        if(!check) return next(new AppError('Post does not exist',400));
        //Check if user is actual author of post
        if(check.author_id !== req.user.id) return next(new AppError('Unauthorized access',400));

        //Delete Forum
        await Alumni.deleteForum(forumId);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: 'Post has been successfully deleted'
        })
    } catch (error) {
        next(error)
    }
}

//Reply Forum Post
exports.replyForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;

        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

         //Check if post exists
         if(!check) return next(new AppError('Post does not exist',400));
        
         //Get data
         const data = req.body

         //Check if user has provided require value
         if(!data.description) return next(new AppError("Please fill in require values",400));

         //Assing data the value of the forum id
         data.forum_id = forumId;

         //Assign repliers name in data object
         data.replier = req.user.first_name + ' ' + req.user.last_name

         //Assign replier id in data object
         data.replier_id = req.user.id;

         //Reply to forum
         const reply = await Alumni.replyForum(data);

         //Response
         res.status(200).json({
            status:'SUCCESS',
            message: "Replied to post successfully",
            data:{reply}
         })
         
    } catch (error) {
        next(error)
    }
}

// //Get replies to forum post
// exports.getReplyToForum = async(req,res,next)=>{
//     try {
//         //Get forum id from params
//         const forumId = req.params.forumId;

//         //Check if post belongs to author or not
//         const check = await Alumni.getSingleForum(forumId);

//          //Check if post exists
//          if(!check) return next(new AppError('Post does not exist',400));

//          //Reply to forum
//          const replies = await Alumni.getAllRepliesToForum(forumId);

//          //Response
//          res.status(200).json({
//             status:'SUCCESS',
//             data:{replies}
//          })
         
//     } catch (error) {
//         next(error)
//     }
// }

//Get replies to forum post
exports.getReplyToForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;

        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

         //Check if post exists
         if(!check) return next(new AppError('Post does not exist',400));

         //Reply to forum
         const replies = await Alumni.getAllRepliesToForum(forumId);

         //Response
         res.status(200).json({
            status:'SUCCESS',
            length: replies.length,
            data:{replies}
         })
         
    } catch (error) {
        next(error)
    }
}

//Get single forum post
exports.getSingleForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;

        //Check if post belongs to author or not
        const post = await Alumni.getSingleForum(forumId);

         //Check if post exists
         if(!post) return next(new AppError('Post does not exist',400));

         //Response
         res.status(200).json({
            status:'SUCCESS',
            data:{post}
         })
         
    } catch (error) {
        next(error)
    }
}


//Update Replies to forum post
exports.updateRepliesToForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;

        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

         //Check if post exists
         if(!check) return next(new AppError('Post does not exist',400));

         //Get reply id from params
         const replyId = req.params.replyId;

         //const check if reply exists
         const checkReply = await Alumni.getSingleReplyToForum(replyId);

         if(!checkReply)return next(new AppError('Reply does not exist',400));

         //Check if reply belongs to replier
         if(req.user.id !== checkReply.replier_id) 
         return next(new AppError('Unauthorized access',400));

         //Get data from body
         const data = req.body

         //assign reply id to ata
         data.replyId = replyId

         //Update reply
         const reply = await Alumni.updateReplyToForum(data)

         //Response
         res.status(200).json({
            status:'SUCCESS',
            data:{reply}
         })
         
    } catch (error) {
        next(error)
    }
}

//Delete Replies from forum post
exports.deleteRepliesToForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;

        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

         //Check if post exists
         if(!check) return next(new AppError('Post does not exist',400));

         //Get reply id from params
         const replyId = req.params.replyId;

         //const check if reply exists
         const checkReply = await Alumni.getSingleReplyToForum(replyId);

         if(!checkReply)return next(new AppError('Reply does not exist',400));

         //Check if reply belongs to replier
         if(req.user.id !== checkReply.replier_id) 
         return next(new AppError('Unauthorized access',400));

         //Update reply
         await Alumni.deleteReplyToForum(replyId)

         //Response
         res.status(200).json({
            status:'SUCCESS',
            message: "Succesfully deleted reply"
         })
         
    } catch (error) {
        next(error)
    }
}


//Report Forum Post
exports.reportForum = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));

        //Get forum id from params
        const forumId = req.params.forumId;

        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

         //Check if post exists
         if(!check) return next(new AppError('Post does not exist',400));

         //Check if user is actual author of post
         if(check.author_id === req.user.id) return next(new AppError('User can not report themselves',400));
        
         //Get data
         const data = req.body

         //Check if user has provided require value
         if(!data.description) return next(new AppError("Please fill in require values",400));

        //Assing data the value of the forum id
        data.forum_id = forumId;

        //Assign reporter name in data object
        data.reporter = req.user.first_name + ' ' + req.user.last_name

        //Assign reporter id in data object
        data.reporter_id = req.user.id;

        //Assign author name in data object
        data.author = check.author;

         //Report
        await Alumni.reportForum(data);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message:"Forum Reported Successfully",
        })
    } catch (error) {
        next(error)
    }
}

//Get minimum data of alumni of those who posted on forum
exports.getMinimumAlumniInfo = async(req,res,next)=>{
    try {
        //Check if user is banned from forum
        if(req.user.banned) return next(new AppError("The user has been banned from using the discussion forum",400));
        
        //Get forum id from params
        const forumId = req.params.forumId;

        //Check if post belongs to author or not
        const check = await Alumni.getSingleForum(forumId);

         //Check if post exists
         if(!check) return next(new AppError('Post does not exist',400));

         //Get minimum info about alumni
         const alumni = await Alumni.getMinimumAlumniInfo(check.author_id);

         //Response
         res.status(200).json({
            status:'SUCCESS',
            data:{alumni}
         })
         
    } catch (error) {
        next(error)
    }
}

//Get All Events
exports.getAllEvents = async(req,res,next)=>{
    try {
        //Get all events
        const events = await Alumni.getAllEvent()

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
        const event = await Alumni.getSingleEvent(eventId)

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

//Update Profile
exports.updateProfle = async(req,res,next)=>{
    try {
        //Get data from body
        const data = req.body;
        //Assign user id in data
        data.alumniId = req.user.id
        //call DAL
        const updatedProfile = await Alumni.updateProfile(data);

        //Response
        res.status(200).json({
            status:"SUCCESS",
            message: "Profile Updated Successfully",
            data:{updatedProfile}
        })
    } catch (error) {
        next(error)
    }
}

//Get Alumni
exports.getAlumniProfile = async(req,res,next)=>{
    try {
        //Get alumni
        const alumni = await Alumni.getSingleAlumniForProfile(req.user.id);

        //Response
        res.status(200).json({
            status:'SUCCESS',
            data:{alumni}
        })
    } catch (error) {
        next(error)
    }
}

//Change password
exports.changePassword = async(req,res,next)=>{
    try {
        //Get new password from body
        const newPassword = req.body.newPassword

        //Create data object to hold all parameters for DAL
        const data = {};
        
        //check if new password is given
        if(!newPassword) return next(new AppError('Please provide a new password',400))

        //Check if new password is at least 5 characters long
        if(newPassword.length < 5) return next(new AppError('Password must be at least five characters',400))

        //encrypt password
        data.newPassword = await bcrypt.hash(newPassword, 8);

        //Get users account id and store it in data object
        data.accountId = req.user.account;

        //Change password
        const changedPassword = await Alumni.changePassword(data);


        //Response
        res.status(200).json({
            status:"SUCCESS",
            message:"Password has been changed, please login again"
        })

    } catch (error) {
        next(error)
    }
}

