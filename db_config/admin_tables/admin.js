//Require db connection
const pool = require('../../loader/db');

//create alumni table function
const admin_table = ()=>{
    pool.query(`CREATE TABLE admin(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        grandfather_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(10) UNIQUE,
        account INT REFERENCES account ON DELETE RESTRICT,
        role VARCHAR(100) DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('TABLE CREATED SUCCESSFULLY')
            
        }
    })
}

admin_table();
