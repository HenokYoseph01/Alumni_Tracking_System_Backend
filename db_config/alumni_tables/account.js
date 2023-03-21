//Require db connection
const pool = require('../../loader/db');

//create registration function
const account_table = ()=>{
    
        pool.query(`CREATE TABLE account(
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            role VARCHAR(100) NOT NULL,
            password_changed_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,(err,res)=>{
            if(err){
                console.log(err)
            }else{
                console.log('TABLE CREATED SUCCESSFULLY')
                
            }
        })
}

account_table()