//Require db connection
const pool = require('../../loader/db');

//create head table function
const report_table = ()=>{
    pool.query(`CREATE TABLE report(
        id SERIAL PRIMARY KEY,
        batch VARCHAR(10),
        employed_count INT,
        unemployed_count INT,
        male_graduate_count INT,
        female_graduate_count INT,
        salary_below_ten_count INT,
        salary_below_twenty_count INT,
        salary_above_twenty_count INT,
        tech_based_occupation INT,
        non_tech_based_occupation INT,
        satisfaction_five_count INT,
        satisfaction_four_count INT,
        satisfaction_three_count INT,
        satisfaction_two_count INT,
        satisfaction_one_count INT,
        university_aid_count INT,
        non_university_aid_count INT
        )`,(err,res)=>{
            if(err){
                console.log(err)
            }else{
                console.log('TABLE CREATED SUCCESSFULLY')
                
            }
    })
}

//Execute table function
report_table();