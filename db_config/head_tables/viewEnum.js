//Require db connection
const pool = require('../../loader/db');

//create announcment view enumeration function
const view_enum = ()=>{
    pool.query(`CREATE TYPE view_enum as ENUM('Public','Alumni')`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('ENUM CREATED SUCCESSFULLY')
            
        }
    })
}

//Execute enum function
view_enum();