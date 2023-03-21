//Require db connection
const pool = require('../../loader/db');

//create alumni table function
const alumni_reply_table = ()=>{
    pool.query(`CREATE TABLE alumni_replies(
        id SERIAL PRIMARY KEY,
        replier_id INT REFERENCES alumni ON DELETE CASCADE,
        forum_id INT REFERENCES forum ON DELETE CASCADE,
        description TEXT,
        replier_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('TABLE CREATED SUCCESSFULLY')
            
        }
    })
}

alumni_reply_table();