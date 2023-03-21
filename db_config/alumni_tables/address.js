//Require db connection
const pool = require('../../loader/db');

//create address table function
const address_table = ()=>{
    pool.query(`CREATE TABLE address(
        id SERIAL PRIMARY KEY,
        region VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        subcity VARCHAR(100) NOT NULL,
        woreda VARCHAR(4) NOT NULL,
        kebele VARCHAR(100) NOT NULL,
        house_no VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('TABLE CREATED SUCCESSFULLY')
        }
    })
}

//Run function
address_table();