//This file is the data access layer meant to provide CRUD functionalities for the 
//alumni side of the system

//Require db pool
const pool = require('../../loader/db');

//Create DAL class
class Alumni{

    //static method to register data into the alumni, address, place of work, and registration tables
    static async register(data){
         //Multi query block started
         const client = await pool.connect();
        try {
                //Start transaction
                await client.query('BEGIN');

                //Address query text
                const address_query = `
                INSERT INTO address
                (city,subcity,woreda,kebele,house_no,region) VALUES
                ($1,$2,$3,$4,$5,$6) RETURNING *
                `;

                //input address
               const address = await client.query({
                name: "addAddress",
                text: address_query,
                values: [data.city,data.subcity,data.woreda,data.kebele,data.house_no,data.region]
               });

               //Questionnaire query text
               const questionnaire_query = `
               INSERT INTO questionnaire
               (category_of_work,salary,satisfaction,attainment) VALUES
               ($1,$2,$3,$4) RETURNING *
               `;

               //input questionnaire
               const questionnaire = await client.query({
                name: "addQuestionnaire",
                text: questionnaire_query,
                values: [data.category_of_work,data.salary,data.satisfaction,data.attainment]
               })


               //registeration query
               const registertion = `
               UPDATE alumni SET
               first_name = COALESCE($1,first_name),
               last_name = COALESCE($2,last_name),
               grandfather_name = COALESCE($3,grandfather_name),
               phone_number = COALESCE($4,phone_number),
               phone_number_alt = COALESCE($5,phone_number_alt),
               nationality = COALESCE($6,nationality),
               gender = COALESCE($7,gender),
               email = COALESCE($8,email),
               linkedIn = COALESCE($9,linkedIn),
               address = COALESCE($10,address),
               occupation = COALESCE($11,occupation),
               date_of_graduation = COALESCE($12,date_of_graduation),
               GPA = COALESCE($13,GPA),
               department = COALESCE($14,department),
               questionnaire = COALESCE($15,questionnaire),
               registered = COALESCE($16,registered),
               place_of_work = COALESCE($17,place_of_work)
               WHERE id = $18
               RETURNING *
               `

               //Register alumni
               const {rows} = await client.query({
                name:"registerAlumni",
                text:registertion,
                values:[
                    data.first_name,
                    data.last_name,
                    data.grandfather_name,
                    data.phone_number1,
                    data.phone_number_alt,
                    data.nationality,
                    data.gender,
                    data.email,
                    data.linkedIn,
                    address.rows[0].id,
                    data.occupation,
                    data.date_of_graduation,
                    data.gpa,
                    data.department,
                    questionnaire.rows[0].id,
                    true,
                    data.workname,
                    data.alumniId
                ]
               });

               //Commit transaction
               await client.query("COMMIT");

               //return row as json
               return rows[0];

        } catch (error) {
            //Rollback transaction
            await client.query("ROLLBACK")
            throw error
        }finally{
            client.release();
        }
    }
    

    static async alumniLogin(email){
        try {
            //Login query
            const text = "SELECT * FROM alumni WHERE email=$1";

            //Get Alumni
            const {rows} = await pool.query({
                name: "alumni_login",
                text,
                values: [email]
            });
            //return result
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Get account
    static async getAlumiAccount(accountId){
        try {
            //query
            const text = "SELECT * FROM account WHERE id = $1"

            //Get account
            const {rows} = await pool.query({
                name:"get_account",
                text,
                values:[accountId]
            })
            //Return results
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    static async getSingleAlumni(data){
        try {
           const {rows} = await pool.query({
                name:'get_single_alumni',
                text: `SELECT * FROM alumni WHERE id = $1`,
                values:[data]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Get Single Alumni with required profile information
    static async getSingleAlumniForProfile(data){
        try {
           const {rows} = await pool.query({
                name:'get_single_alumni_profile',
                text: `
                SELECT id, first_name, last_name, grandfather_name, place_of_work, occupation,
                GPA, phone_number,email
                 FROM alumni WHERE id = $1`,
                values:[data]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //upload picture
    static async uploadPhoto(pictureURL,publicId,id){
        try {
            //Query
            const text = 
            `UPDATE alumni SET
             photo_url = COALESCE($1,photo_url),
             photo_public_id = COALESCE($2, photo_public_id)
             WHERE id = $3 RETURNING *
            `
            const {rows} = await pool.query({
                name: 'upload_photo',
                text,
                values: [pictureURL,publicId,id]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Create Forum
    static async createForum(data){
        try {
            //text
            const text = `
            INSERT INTO forum(title,description,author,author_id)
            VALUES ($1,$2,$3,$4) RETURNING *
            `;

            //Execute query
            const {rows} = await pool.query({
                name:'create_forum',
                text,
                values:[
                    data.title,
                    data.description,
                    data.author,
                    data.id
                ]
            });
            //return value
            return rows[0]
        } catch (error) {
            throw error
        }
    }

    //Get all forum
    static async getAllForum(){
        try {
            //Query
            const text = `SELECT * FROM forum ORDER BY created_at DESC`

            //Execute query
            const {rows} = await pool.query({
                name: 'get_all_forums',
                text
            });
            //return value
            return rows;
        } catch (error) {
            throw error
        }
    }

    //Get author forum
    static async getAuthorForum(id){
        try {
            //Query
            const text = `SELECT * FROM forum WHERE author_id = $1 ORDER BY created_at DESC`

            //Execute query
            const {rows} = await pool.query({
                name: 'get_author_forums',
                text,
                values:[id]
            });
            //return value
            return rows;
        } catch (error) {
            throw error
        }
    }
    //Get Single forum
    static async getSingleForum(id){
        try {
            //Query
            const text = `SELECT * FROM forum WHERE id = $1`

            //Execute query
            const {rows} = await pool.query({
                name: 'get_single_forum',
                text,
                values:[id]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Update forum
    static async updateForum(data){
        try {
            //Query
            const text = 
            `UPDATE forum SET 
             title = COALESCE($1,title),
             description = COALESCE($2,description)
             WHERE id = $3
             RETURNING *
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'update_forum',
                text,
                values:[
                    data.title,
                    data.description,
                    data.id
                ]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Delete forum
    static async deleteForum(forumId){
        try {
            //Query
            const text = 
            `DELETE FROM forum WHERE id=$1
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'delete_forum',
                text,
                values:[
                    forumId
                ]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Reply to forum
    static async replyForum(data){
        try {
            //Query
            const text = 
            `INSERT INTO alumni_replies(replier_id,forum_id,description,replier_name)
             VALUES($1,$2,$3,$4) RETURNING *
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'reply_to_forum',
                text,
                values:[
                    data.replier_id,
                    data.forum_id,
                    data.description,
                    data.replier
                ]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Get replies to forum
    static async getAllRepliesToForum(forumId){
        try {
            //Query
            const text = 
            `
            SELECT replier_name, description FROM alumni_replies
            WHERE forum_id = $1
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'get_replies_to_forum',
                text,
                values:[forumId]
            });
            //return value
            return rows;
        } catch (error) {
            throw error
        }
    }

     //Get single reply
     static async getSingleReplyToForum(replyId){
        try {
            //Query
            const text = 
            `
            SELECT * FROM alumni_replies
            WHERE id = $1 
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'get_single_reply_to_forum',
                text,
                values:[replyId]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Update reply
    static async updateReplyToForum(data){
        try {
            //Query
            const text = 
            `
            UPDATE alumni_replies SET
            description = COALESCE($1,description)
            WHERE id=$2
            RETURNING *
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'update_reply_to_forum',
                text,
                values:[
                    data.description,
                    data.replyId
                ]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Delete reply
    static async deleteReplyToForum(replyId){
        try {
            //Query
            const text = 
            `
              DELETE FROM alumni_replies 
              WHERE id = $1
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'delete_reply_from_forum',
                text,
                values:[
                    replyId
                ]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Report forum
    static async reportForum(data){
        try {
            //Query
            const text = 
            `INSERT INTO alumni_report(reporter_id,forum_id,description,reporter_name,author_name)
             VALUES($1,$2,$3,$4,$5) RETURNING *
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'report_forum',
                text,
                values:[
                    data.reporter_id,
                    data.forum_id,
                    data.description,
                    data.reporter,
                    data.author
                ]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Report forum
    static async getMinimumAlumniInfo(alumniId){
        try {
            //Query
            const text = 
            `
            SELECT first_name, last_name, grandfather_name, gender, occupation, place_of_work, 
            linkedIn, date_of_graduation FROM alumni
            WHERE id = $1
            `

            //Execute query
            const {rows} = await pool.query({
                name: 'minimum_info_alumni',
                text,
                values:[alumniId]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Get all events
    static async getAllEvent(){
        try {
          
            //text
            const text = `SELECT * FROM announcement`
            //Get event
            const {rows} = await pool.query({
                name:'get_all_event_alumni',
                text
            })
            //return value
            return rows;
        } catch (error) {
            throw error
        }
    }
    
    //Get single event
    static async getSingleEvent(id){
        try {
            //text
            const text = `SELECT * FROM announcement WHERE id=$1`
            //Get event
            const {rows} = await pool.query({
                name:'get_single_event_alumni',
                text,
                values:[id]
            })
            //return value
            return rows[0]
        } catch (error) {
            throw error
        }
    }
    
    //Update profile
    static async updateProfile(data){
        //Multi query block started
        const client = await pool.connect();
       try {
               //Start transaction
               await client.query('BEGIN');

            //Address query text
            const address_query = `
            UPDATE address SET
            city = COALESCE($1,city),
            subcity = COALESCE($2,subcity),
            woreda = COALESCE($3, woreda),
            kebele = COALESCE($4, kebele),
            house_no = COALESCE($5, house_no),
            region = COALESCE($6, region)
            WHERE id = $7
            RETURNING *
            `;

            //input address
            const address = await client.query({
            name: "updateAddress",
            text: address_query,
            values: [data.city,data.subcity,data.woreda,data.kebele,data.house_no,data.region,data.alumniId]
            });

            //Get address data
            const updatedAddress = address.rows[0]
              
          const updateProfile = `
          UPDATE alumni SET
          first_name = COALESCE($1,first_name),
          last_name = COALESCE($2,last_name),
          grandfather_name = COALESCE($3,grandfather_name),
          phone_number = COALESCE($4,phone_number),
          phone_number_alt = COALESCE($5,phone_number_alt),
          nationality = COALESCE($6,nationality),
          gender = COALESCE($7,gender),
          email = COALESCE($8,email),
          linkedIn = COALESCE($9,linkedIn),
          occupation = COALESCE($10,occupation),
          place_of_work = COALESCE($11,place_of_work)
          WHERE id = $12
          RETURNING *
          `

          //Register alumni
          const {rows} = await client.query({
           name:"UpdateAlumni",
           text:updateProfile,
           values:[
               data.first_name,
               data.last_name,
               data.grandfather_name,
               data.phone_number1,
               data.phone_number_alt,
               data.nationality,
               data.gender,
               data.email,
               data.linkedIn,
               data.occupation,
               data.workname,
               data.alumniId
           ]
          });
              //Commit transaction
              await client.query("COMMIT");

              //Updated Profile
              const updatedProfile = rows[0]
              //Object with both address and updated profile
              const updatedData = {...updatedProfile,...updatedAddress}
              //return row as json
              return updatedData;

       } catch (error) {
           //Rollback transaction
           await client.query("ROLLBACK")
           throw error
       }finally{
           client.release();
       }
   }

   //Change password
   static async changePassword(data){
    try {
        //change password text
        const text = 
        `
        UPDATE account SET
        password = $1
        WHERE id = $2
        RETURNING *
        `
        //Execute query
        const {rows} = await pool.query({
            name: 'update_password',
            text,
            values:[
                data.newPassword,
                data.accountId
            ]
        })
        //return value
        return rows[0]
    } catch (error) {
        throw error
    }
   }

}


module.exports = Alumni