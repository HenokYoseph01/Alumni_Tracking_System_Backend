//Require db connection
const pool = require('../../loader/db');

//create place of work table function
const questionnaire = ()=>{
    pool.query(`CREATE TABLE questionnaire(
        id SERIAL PRIMARY KEY,
        category_of_work VARCHAR(100) NOT NULL,
        salary INT,
        satisfaction INT,
        attainment VARCHAR(10)
    )`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('TABLE CREATED SUCCESSFULLY')
            
        }
    })
}

questionnaire();