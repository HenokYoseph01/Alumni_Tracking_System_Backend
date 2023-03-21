//Require db connection
const pool = require('../../loader/db');

//create head table function
const head_table = ()=>{
    pool.query(`CREATE TABLE head(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        grandfather_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(10) UNIQUE,
        account INT REFERENCES account ON DELETE RESTRICT,
        department VARCHAR(100),
        role VARCHAR(100) DEFAULT 'Head',
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
head_table();