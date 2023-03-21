//Require db connection
const pool = require('../../loader/db');

//create alumni table function
const alumni_table = ()=>{
    pool.query(`CREATE TABLE alumni(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        grandfather_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(10) UNIQUE,
        phone_number_alt VARCHAR(10) UNIQUE,
        nationality VARCHAR(100),
        email VARCHAR(100) NOT NULL UNIQUE,
        gender VARCHAR(10) NOT NULL,
        linkedIn VARCHAR(100) UNIQUE,
        address INT REFERENCES address ON DELETE SET NULL,
        account INT REFERENCES account ON DELETE RESTRICT,
        occupation VARCHAR(100),
        place_of_work VARCHAR(100),
        date_of_graduation VARCHAR(10) NOT NULL,
        questionnaire INT REFERENCES questionnaire ON DELETE CASCADE,
        GPA NUMERIC(3,2) NOT NULL,
        department VARCHAR(100),
        role VARCHAR(100) DEFAULT 'Alumni',
        photo_url VARCHAR(200),
        photo_public_id VARCHAR(200),
        report_warnings INT DEFAULT 0,
        event_joined INT,
        discussion_forum INT,
        replied_forum INT,
        registered BOOLEAN NOT NULL DEFAULT 'false',
        banned BOOLEAN NOT NULL DEFAULT 'false',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('TABLE CREATED SUCCESSFULLY')
            
        }
    })
}

alumni_table();
