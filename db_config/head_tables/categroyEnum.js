//Require db connection
const pool = require('../../loader/db');

//create category enumeration function
const cat_enum = ()=>{
    pool.query(`CREATE TYPE category_enum as ENUM('Event','Seminar','Job Offers')`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('ENUM CREATED SUCCESSFULLY')
            
        }
    })
}

//Execute enum function
cat_enum();