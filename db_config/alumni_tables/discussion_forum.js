//Require db connection
const pool = require('../../loader/db');

//create alumni table function
const discussion_forum_table = ()=>{
    pool.query(`CREATE TABLE forum(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        author_id INT REFERENCES alumni ON DELETE CASCADE,
        reported BOOLEAN DEFAULT 'FALSE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log('TABLE CREATED SUCCESSFULLY')
            
        }
    })
}

discussion_forum_table();