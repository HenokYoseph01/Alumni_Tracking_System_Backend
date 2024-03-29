
//Require db pool
const pool = require('../../loader/db');

class Guest{
    //Get all events
    static async getAllEvent(data){
        try {
        
            //text
            const text = `SELECT * FROM announcement WHERE viewable = 'Public' LIMIT 5 OFFSET $1`
            //Get event
            const {rows} = await pool.query({
                name:'get_all_event_public',
                text,
                values:[data]
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
            const text = `SELECT * FROM announcement WHERE id=$1 AND viewable = 'Public'`
            //Get event
            const {rows} = await pool.query({
                name:'get_single_event_public',
                text,
                values:[id]
            })
            //return value
            return rows[0]
        } catch (error) {
            throw error
        }
    }

    //Get minimum alumni info
    static async getMinimumAlumniInfo(year){
        try {
            //text
            const text = `SELECT id, first_name, 
            last_name,grandfather_name,photo_url 
            FROM alumni
            WHERE date_of_graduation = $1
            ORDER BY first_name, last_name, grandfather_name`
            //Get event
            const {rows} = await pool.query({
                name:'get_alumni_public',
                text,
                values:[year]
            })
            //return value
            return rows;
        } catch (error) {
            throw error
        }
    }
}

module.exports = Guest;