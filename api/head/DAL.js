//Require pool
const pool = require('../../loader/db');

//Create DAL class
class Head{

    //Login for Head
    static async headLogin(email){
        try {
            //Login query
            const text = "SELECT * FROM head WHERE email=$1";

            //Get Alumni
            const {rows} = await pool.query({
                name: "head_login",
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
     static async getHeadAccount(accountId){
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

    static async getSingleHead(data){
        try {
           const {rows} = await pool.query({
                name:'get_single_head',
                text: `SELECT * FROM head WHERE id = $1`,
                values:[data]
            })

            return rows[0];
        } catch (error) {
            throw error
        }
    }

    static async createEvent(data){
        try {
            //prepare text
            const text = `INSERT INTO 
            announcement(name,category,description,event_date,time_start,time_end,venue,host,viewable)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

            //Create Event
            const {rows} = await pool.query({
                name:'create_event',
                text,
                values:[
                    data.name,
                    data.category,
                    data.description,
                    data.event_date,
                    data.time_start,
                    data.time_end,
                    data.venue,
                    data.host,
                    data.viewable
                ]
            })
            //return value
            return rows[0];
        } catch (error) {
            throw error
        }
    }

    //Update event
    static async updateEvent(data){
        try {
            const text = `
            UPDATE announcement SET
            name = COALESCE($1,name),
            category = COALESCE($2,category),
            description = COALESCE($3,description),
            event_date = COALESCE($4,event_date),
            time_start = COALESCE($5,time_start),
            time_end = COALESCE($6,time_end),
            venue = COALESCE($7,venue),
            host = COALESCE($8,host),
            viewable = COALESCE($9,viewable)
            WHERE id = $10
            RETURNING *            
            `
            //Update event
            const {rows} = await pool.query({
                name:'update_event',
                text,
                values:[
                    data.name,
                    data.category,
                    data.description,
                    data.event_date,
                    data.time_start,
                    data.time_end,
                    data.venue,
                    data.host,
                    data.viewable,
                    data.eventId
                ]
            })
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
                name:'get_all_event',
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
                name:'get_single_event',
                text,
                values:[id]
            })
            //return value
            return rows[0]
        } catch (error) {
            throw error
        }
    }

    //Delete All Event
    static async deleteAllEvent(){
        try{
            //text
            const text = `DELETE FROM announcement`

            //delete event
            const {rows} = await pool.query({
                name: 'delete_all_event',
                text
            })
        }catch(error){
            throw error
        }
    }

    //Delete Single Event
    static async deleteSingleEvent(id){
        try{
            //text
            const text = `DELETE FROM announcement WHERE id=$1`

            //delete event
            const {rows} = await pool.query({
                name: 'delete_single_event',
                text,
                values:[id]
            })
            
        }catch(error){
            throw error
        }
    }

    //Get Alumnus
    static async getAllAlumnus(){
        try {
            //Text
            const text = `SELECT * from alumni ORDER BY "first_name", "last_name","grandfather_name"`

            //Get Alumnus
            const {rows} = await pool.query({
                name: 'get_all_alumnus',
                text
            });
            //return values
            return rows 
        } catch (error) {
            throw error
        }
    }

    //Generate Report
    static async generateReport(batch){
        //Multi query block started
        const client = await pool.connect();
        try {
            //Start transaction
            await client.query('BEGIN');

            //Data variable to hold all data returned
            const data = {}
            //Query for getting total count of alumni in given batch
            const totalAlumniBatchQuery = `
                SELECT COUNT(id) FROM alumni WHERE date_of_graduation = $1
            ` 
            //Get total alumni count
            const alumniCount = await client.query({
                name: 'get_alumni_count',
                text: totalAlumniBatchQuery,
                values:[batch]
            })
            //Set the count value to a new variable
            const counter = alumniCount.rows[0].count;

            //Query to get all alumni who are not yet employed
            const totalUnemployedAlumniQuery = `
                SELECT COUNT(id) FROM alumni WHERE occupation IS NULL AND date_of_graduation = $1
            `
            //Get total unemployed alumni count
            const UnemployedCount = await client.query({
                name: 'get_unemployed_alumni_count',
                text: totalUnemployedAlumniQuery,
                values:[batch]
            })
            //Set unemployed count 
            data.unemployed = Number.parseInt(UnemployedCount.rows[0].count)

            //Get employed alumni count
            data.employed = Number.parseInt(counter - data.unemployed)

            //Salary Section
            
            //Get total male graduates
            const totalMaleGrauates = `
                SELECT COUNT(gender) FROM alumni WHERE gender = $1 AND date_of_graduation = $2
            `
             //Get total male alumni count
             const MaleCount = await client.query({
                name: 'get_male_alumni_count',
                text: totalMaleGrauates,
                values:['Male',batch]
            })
            data.male_alumni = Number.parseInt(MaleCount.rows[0].count);

            //Female alumni
            data.female_alumni = Number.parseInt(counter - data.male_alumni)
            
            //Salary Section
            
            //Write query for salary under 10K 
            const salaryunderten = `
                SELECT COUNT(q.salary) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE q.salary < $1 AND a.date_of_graduation = $2
            `
             //Get salary under 10K for alumni
             const salaryundertenCount = await client.query({
                name: 'get_salary_under_ten',
                text: salaryunderten,
                values:[10000, batch]
            })
            
            data.salaryunderten = Number.parseInt(salaryundertenCount.rows[0].count)

            //Write query for salary under 20K 
            const salaryundertwenty = `
                SELECT COUNT(q.salary) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE q.salary BETWEEN $1 AND $2 AND a.date_of_graduation = $3
            `
             //Get salary under 20K for alumni
             const salaryundertwentyCount = await client.query({
                name: 'get_salary_under_twenty',
                text: salaryundertwenty,
                values:[10000,20000,batch]
            })
            
            data.salaryundertwenty = Number.parseInt(salaryundertwentyCount.rows[0].count)

            //Write query for salary above 20K 
            const salaryabovetwenty = `
                SELECT COUNT(q.salary) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE q.salary > $1 AND a.date_of_graduation = $2
            `
             //Get salary above 20K for alumni
             const salaryabovetwentyCount = await client.query({
                name: 'get_salary_above_twenty',
                text: salaryabovetwenty,
                values:[20000,batch]
            })
            
            data.salaryabovetwenty = Number.parseInt(salaryabovetwentyCount.rows[0].count)

            //Tech based occupations (Some options, other tech, tech)
            //Write query for occupation count
            const OccupationQuery = `
                SELECT COUNT(q.category_of_work) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE a.date_of_graduation = $1
            `
             //Get salary above 20K for alumni
             const occupationCount = await client.query({
                name: 'get_occupation_count',
                text: OccupationQuery,
                values:[batch]
            })
            
            const totalOccupationCount = occupationCount.rows[0].count;

            //Write query for non tech occupation count
            const nonTechOccupationQuery = `
                SELECT COUNT(q.category_of_work) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE a.date_of_graduation = $1 AND q.category_of_work = $2
            `
             //Get salary above 20K for alumni
             const nonTechOccupationCount = await client.query({
                name: 'get_nontech_occupation_count',
                text: nonTechOccupationQuery,
                values:[batch,'non-tech']
            })

            data.nonTech = Number.parseInt(nonTechOccupationCount.rows[0].count)

            //Get tech based occupation count
            data.techCount = Number.parseInt(totalOccupationCount-data.nonTech)

            //Write query for getting the satisfaction count
            const satisfactionQuery = `
                SELECT COUNT(satisfaction) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE a.date_of_graduation = $1 AND q.satisfaction = $2
            `
             //Get salary above 20K for alumni
             const satisfactionOfFive = await client.query({
                name: 'get_satisfaction_five_count',
                text: satisfactionQuery,
                values:[batch, 5]
            })

            //Get salary above 20K for alumni
            const satisfactionOfFour = await client.query({
                name: 'get_satisfaction_four_count',
                text: satisfactionQuery,
                values:[batch, 4]
            })
            //Get salary above 20K for alumni
            const satisfactionOfThree = await client.query({
                name: 'get_satisfaction_three_count',
                text: satisfactionQuery,
                values:[batch, 3]
            })
            //Get salary above 20K for alumni
            const satisfactionOfTwo= await client.query({
                name: 'get_satisfaction_two_count',
                text: satisfactionQuery,
                values:[batch, 2]
            })
            //Get satisfaction rated one for alumni
            const satisfactionOfOne = await client.query({
                name: 'get_satisfaction_one_count',
                text: satisfactionQuery,
                values:[batch, 1]
            })

            data.satisfactionFive = Number.parseInt(satisfactionOfFive.rows[0].count)
            data.satisfactionFour = Number.parseInt(satisfactionOfFour.rows[0].count)
            data.satisfactionThree = Number.parseInt(satisfactionOfThree.rows[0].count)
            data.satisfactionTwo = Number.parseInt(satisfactionOfTwo.rows[0].count)
            data.satisfactionOne = Number.parseInt(satisfactionOfOne.rows[0].count)

            //attiement portion
            //Write query for getting the total attainment count
            const totalAttinementQuery = `
                SELECT COUNT(attainment) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE a.date_of_graduation = $1
            `
            const totalattinementCount = await client.query({
                name: 'get_total_attainment_count',
                text: totalAttinementQuery,
                values:[batch]
            })

            const totalAttainment = totalattinementCount.rows[0].count


            const totalAgreedattinementQuery = `
                SELECT COUNT(attainment) FROM questionnaire as q 
                INNER JOIN alumni as a ON q.id = a.questionnaire
                WHERE a.date_of_graduation = $1 AND q.attainment = $2
            `
            const totalAgreedattinementCount = await client.query({
                name: 'get_total_agreed_attainment_count',
                text: totalAgreedattinementQuery,
                values:[batch,'yes']
            })
            data.yesAttainment = Number.parseInt(totalAgreedattinementCount.rows[0].count)

            //Get attainment marked as no
            data.noAttainment = Number.parseInt(totalAttainment - data.yesAttainment)
            
            //Insert into report table
            const insertQuery = `
                INSERT INTO report(batch,employed_count,unemployed_count,male_graduate_count,
                    female_graduate_count, salary_below_ten_count, salary_below_twenty_count,
                    salary_above_twenty_count,tech_based_occupation,non_tech_based_occupation,
                    satisfaction_five_count, satisfaction_four_count,satisfaction_three_count,
                    satisfaction_two_count,satisfaction_one_count,university_aid_count,
                    non_university_aid_count) 
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
                    RETURNING *
            `

            //Insert into report table
            const {rows} = await client.query({
                name:'insert_report',
                text: insertQuery,
                values:[
                    batch,
                    data.employed,
                    data.unemployed,
                    data.male_alumni,
                    data.female_alumni,
                    data.salaryunderten,
                    data.salaryundertwenty,
                    data.salaryabovetwenty,
                    data.techCount,
                    data.nonTech,
                    data.satisfactionFive,
                    data.satisfactionFour,
                    data.satisfactionThree,
                    data.satisfactionTwo,
                    data.satisfactionOne,
                    data.yesAttainment,
                    data.noAttainment
                ]

            })
            //Commit transaction
            await client.query("COMMIT");
            //return value
            return rows[0]
            
    } catch (error) {
        //Rollback transaction
        await client.query("ROLLBACK")
        throw error
    }finally{
        client.release();
    }
    }

    //Get head profile
    static async getHeadProfile(data){
        try {
            const {rows} = await pool.query({
                name:'get_single_head_profile',
                text: `SELECT first_name, last_name, grandfather_name, email, department, phone_number
                 FROM head WHERE id = $1`,
                values:[data]
            })
            //return value
            return rows[0]
        } catch (error) {
            throw error
        }
    }

    //Search Specfic Alumni(s)
    static async searchAlumni(data){
        try {
            //text
            const text = `
            SELECT first_name, last_name, grandfather_name,GPA,occupation 
            FROM alumni
            WHERE to_tsvector(COALESCE(first_name,' ')||' '||COALESCE(last_name,' ')||' '||COALESCE(grandfather_name,' ')||' '||
            GPA||COALESCE(occupation,' ')) @@ to_tsquery($1)`

            const{rows} = await pool.query({
                name: 'search_alumni',
                text,
                values:[data]
            })
            //return value
            return rows;
        } catch (error) {
            throw(error)
        }
    }

    //Update Head
    static async updateHead(data){
        try {
            //query
            const text = 
            `UPDATE head SET 
             first_name = COALESCE($1,first_name),
             last_name = COALESCE($2,last_name),
             grandfather_name = COALESCE($3,grandfather_name),
             email = COALESCE($4,email),
             phone_number = COALESCE($5,phone_number)
             WHERE id = $6
             RETURNING *
            `
            const {rows} = await pool.query({
                name:'update_head',
                text,
                values:[
                    data.first_name,
                    data.last_name,
                    data.grandfather_name,
                    data.email,
                    data.phone_number,
                    data.headId
                ]
            })

            //Return values
            return rows[0]
        } catch (error) {
            throw error
        }
    }
}

module.exports = Head;