//Require pool
const pool = require('../../loader/db');

//Create DAL class
class Login{

    //Login for users
    static async userLogin(email){
        try {
            //Login query
            const text = "SELECT * FROM account WHERE username=$1";

            //Get Alumni
            const {rows} = await pool.query({
                name: "user_login",
                text,
                values: [email]
            });
            //return result
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Get Alumni
    static async getSingleAlumni(id){
        try {
            //Login query
            const text = "SELECT * FROM alumni WHERE account=$1";

            //Get Alumni
            const {rows} = await pool.query({
                name: "alumni_info",
                text,
                values: [id]
            });
            //return result
            return rows[0];
        } catch (error) {
            throw error
        }
    }
    //Get Head
    static async getSingleHead(id){
        try {
            //Login query
            const text = "SELECT * FROM head WHERE account=$1";

            //Get Alumni
            const {rows} = await pool.query({
                name: "head_info",
                text,
                values: [id]
            });
            //return result
            return rows[0];
        } catch (error) {
            throw error
        }
    }
    //Get Admin
    static async getSingleAdmin(id){
        try {
            //Login query
            const text = "SELECT * FROM admin WHERE account=$1";

            //Get Alumni
            const {rows} = await pool.query({
                name: "admin_info",
                text,
                values: [id]
            });
            //return result
            return rows[0];
        } catch (error) {
            throw error
        }
    }
}

module.exports = Login