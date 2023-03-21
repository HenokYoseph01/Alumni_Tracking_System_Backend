
//Require db pool
const pool = require('../../loader/db');

//Admin DAL

class Admin{
    static async createAlumniAccount(data){
        //Multi query block started
        const client = await pool.connect();
        try {
            //Start transaction
            await client.query('BEGIN');

            //Alumni Account query text
            const alumni_account = `
            INSERT INTO account(username,password,role)
            VALUES ($1, $2,$3) RETURNING *
            `

            //input account
            const account = await client.query({
                name: "alumni_account_creation",
                text: alumni_account,
                values: [data.email,data.password,'alumni']
            });
            
            //Alumni information query text
            const alumni_info = `
            INSERT INTO alumni
            (first_name,last_name,grandfather_name,email,gender,GPA,date_of_graduation,account,department)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
            `;

            //input alumni
            const {rows} = await client.query({
                name: "add_alumni",
                text: alumni_info,
                values: [
                    data.first_name,
                    data.last_name,
                    data.grandfather_name,
                    data.email,
                    data.gender,
                    data.gpa,
                    data.graduation_year,
                    account.rows[0].id,
                    data.department
                ]
            })
            
            //Commit Transaction
            await client.query('COMMIT');

            //return values
            return rows[0];
        } catch (error) {
            await client.query("ROLLBACK")
            throw error
        }finally{
            client.release();
        }
    }

    //Get single Admin
    static async getSingleAdmin(data){
        try {
           const {rows} = await pool.query({
                name:'get_single_admin',
                text: `SELECT * FROM admin WHERE id = $1`,
                values:[data]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Create Head account
    static async createHeadAccount(data){
        //Multi query block started
        const client = await pool.connect();
        try {
            //Start transaction
            await client.query("BEGIN");
            
            //Account query
            const accountText = `
            INSERT INTO account(username,password,role)
            VALUES ($1, $2, $3) RETURNING *
            `

            //Create Account
            const account = await client.query({
                name: 'head_account',
                text: accountText,
                values: [data.email,data.password,'head']
            })

            //Head query
            const headText = `
            INSERT INTO head(first_name,last_name,grandfather_name,
                email,phone_number,department,account) VALUES
                ($1,$2,$3,$4,$5,$6,$7) RETURNING *
            `
    
            //Create Head
            const {rows} = await client.query({
                name: 'head_creation',
                text: headText,
                values:[
                    data.first_name,
                    data.last_name,
                    data.grandfather_name,
                    data.email,
                    data.phone_number,
                    data.department,
                    account.rows[0].id
                ]
            })
            //Commit
            await client.query('COMMIT')
            //Return results
            return rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error
        }finally{
            client.release()
        }
    }

    //Create Admin account
    static async createAdminAccount(data){
        //Multi query block started
        const client = await pool.connect();
        try {
            //Start transaction
            await client.query("BEGIN");
            
            //Account query
            const accountText = `
            INSERT INTO account(username,password,role)
            VALUES ($1, $2, $3) RETURNING *
            `

            //Create Account
            const account = await client.query({
                name: 'admin_account',
                text: accountText,
                values: [data.email,data.password,'admin']
            })

            //Head query
            const headText = `
            INSERT INTO admin(first_name,last_name,grandfather_name,
                email,phone_number,account) VALUES
                ($1,$2,$3,$4,$5,$6) RETURNING *
            `
    
            //Create Head
            const {rows} = await client.query({
                name: 'admin_creation',
                text: headText,
                values:[
                    data.first_name,
                    data.last_name,
                    data.grandfather_name,
                    data.email,
                    data.phone_number,
                    account.rows[0].id
                ]
            })
            //Commit
            await client.query('COMMIT')
            //Return results
            return rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error
        }finally{
            client.release()
        }
    }

    //Update Admin
    static async updateAdmin(data){
        try {
            //query
            const text = 
            `UPDATE admin SET 
             first_name = COALESCE($1,first_name),
             last_name = COALESCE($2,last_name),
             grandfather_name = COALESCE($3,grandfather_name),
             email = COALESCE($4,email),
             phone_number = COALESCE($5,phone_number)
             WHERE id = $6
             RETURNING *
            `
            const {rows} = await pool.query({
                name:'update_admin',
                text,
                values:[
                    data.first_name,
                    data.last_name,
                    data.grandfather_name,
                    data.email,
                    data.phone_number,
                    data.adminId
                ]
            })

            //Return values
            return rows[0]
        } catch (error) {
            throw error
        }
    }

    //Get moderation list
    static async getModerationList(){
        try {
            //Query
            const text =
             `
            SELECT f.id as "forum_id",f.title, ar.author_name, ar.reporter_name, ar.description, a.report_warnings
            FROM alumni_report as ar
            INNER JOIN forum as f ON ar.forum_id = f.id
            INNER JOIN alumni as a ON f.author_id = a.id
             `

             //Execute query
             const {rows} = await pool.query({
                name: 'get_moderation_list',
                text
             });

             //Return rows
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
                name: 'get_single_forum_admin',
                text,
                values:[id]
            });
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    static async getSingleAlumni(data){
        try {
           const {rows} = await pool.query({
                name:'get_single_alumni_for_admin',
                text: `SELECT * FROM alumni WHERE id = $1`,
                values:[data]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Issue warning to alumni
    static async issueWarning(data){
        try {
            //Queey
            const text = 
            `
            UPDATE alumni SET
            report_warnings = report_warnings + 1
            WHERE id = $1
            RETURNING *
            `
           const {rows} = await pool.query({
                name:'issue_warning_for_alumni',
                text,
                values:[data]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Ban alumni from forum
    static async issueBan(data){
        try {
            //Queey
            const text = 
            `
            UPDATE alumni SET
            banned = true
            WHERE id = $1
            RETURNING *
            `
           const {rows} = await pool.query({
                name:'issue_ban_for_alumni',
                text,
                values:[data]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Delete Post
    static async deletePost(forumId){
        try {
          //Delete forum post, deleting the forum post will in turn delete the replies and reports 
          //related to that forum as well.
          const text = 
          `
          DELETE FROM forum WHERE id = $1
          `

          //Execute query
          const {rows} = await pool.query({
            name:'delete_forum_admin',
            text,
            values:[forumId]
          })

          //return value
          return rows[0];
        } catch (error) {
            throw error
        }
    }



}

module.exports = Admin