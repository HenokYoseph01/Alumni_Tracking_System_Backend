//Require db connection
const pool = require('../../loader/db');

//create head table function
const announcement = ()=>{
    pool.query(`CREATE TABLE announcement(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category category_enum,
        description text,
        event_date DATE,
        time_start TIME NOT NULL,
        time_end TIME NOT NULL,
        venue VARCHAR(100) NOT NULL,
        host VARCHAR(100) NOT NULL,
        viewable view_enum,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('TABLE CREATED SUCCESSFULLY')
            
        }
    })
}

//Execute table function
announcement();