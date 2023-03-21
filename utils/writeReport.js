//Require write-excel
const writeExcel = require('write-excel-file/node')

//Require path
const path = require('path')

//Create write excel function
const createExcel = async (data)=>{
    //Create the header and data for the excel sheet
    // const HEADER_ROW = [
    //     {
    //       value: 'Batch',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Employed Alumni',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Unemployed Alumni',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of male Alumni',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of female Alumni',
    //       fontWeight: 'bold',
    //       width: 20
    //     },
    //     {
    //       value: 'Salary below 10,000 birr',
    //       fontWeight: 'bold',
    //       width: 20
    //     },
    //     {
    //       value: 'Salary between 10,000 and 20,000 birr',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: 'Salary above 20,000 birr',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Tech based occupations',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of non-Tech based occupations',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of non-Tech based occupations',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Satisfactions at 5',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Satisfactions at 4',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Satisfactions at 3',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Satisfactions at 2',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of Satisfactions at 1',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of occupations attained due to department',
    //       fontWeight: 'bold',
    //       width: 40
    //     },
    //     {
    //       value: '# of occupations attained not due to department',
    //       fontWeight: 'bold'
    //     },
    //   ]
      

    //   const DATA_ROW = [
    //     {
    //         type: String,
    //         value: data.report.batch,
    //         width: 100
    //     },
    //     {
    //         type: Number,
    //         value: data.report.employed_count,
    //         width: 100
    //     },
    //     {
    //         type: Number,
    //         value: 
    //     },
    //     {
    //         type: Number,
    //         value: 
    //     },
    //     {
    //         type: Number,
    //         value: data.report.female_graduate_count
    //     },
    //     {
    //         type: Number,
    //         value: 
    //     },
    //     {
    //         type: Number,
    //         value: 
    //     },
    //     {
    //         type: Number,
    //         value: 
    //     },
    //     {
    //         type: Number,
    //         value: 
    //     },
    //     {
    //         type: Number,
    //         value: data.
    //     },
    //     {
    //         type: Number,
    //         value:  
    //     },
    //     {
    //         type: Number,
    //         value: data.report.satisfaction_four_count
    //     },
    //     {
    //         type: Number,
    //         value: data.report.satisfaction_three_count
    //     },
    //     {
    //         type: Number,
    //         value: data.report.satisfaction_two_count
    //     },
    //     {
    //         type: Number,
    //         value: data.report.satisfaction_one_count
    //     },
    //     {
    //         type: Number,
    //         value: data.report.university_aid_count
    //     },
    //     {
    //         type: Number,
    //         value: data.report.non_university_aid_count
    //     },
    //   ]

    //   const excelData = [
    //     HEADER_ROW,
    //     DATA_ROW
    //   ]

    const object =[ {
        batch: data.report.batch ,
        employed: data.report.employed_count ,
        unemployed: data.report.unemployed_count ,
        male: data.report.male_graduate_count ,
        female: data.report.female_graduate_count,
        salaryten: data.report.salary_below_ten_count ,
        salarytentwenty: data.report.salary_below_twenty_count ,
        salarytwenty: data.report.salary_above_twenty_count,
        tech: data.report.tech_based_occupation ,
        nonTech: data.report.non_tech_based_occupation ,
        satisfactionFive: data.report.satisfaction_five_count,
        satisfactionFour: data.report.satisfaction_four_count,
        satisfactionThree: data.report.satisfaction_three_count,
        satisfactionTwo: data.report.satisfaction_two_count,
        satisfactionOne: data.report.satisfaction_one_count,
        attainment: data.report.university_aid_count,
        nonattainment: data.report.non_university_aid_count
    }]

    const schema = [
        {
            column: 'Batch',
            type: String,
            value: data => data.batch,
            width: 40
        },
        {
            column: '# of Employed Alumni',
            type: Number,
            value: data => data.employed,
            width: 40
        },
        {
            column: '# of Unemployed Alumni',
            type: Number,
            value: data => data.unemployed,
            width: 40
        },
        {
            column: '# of male Alumni',
            type: Number,
            value: data => data.male,
            width: 40
        },
        {
            column: '# of female Alumni',
            type: Number,
            value: data => data.female,
            width: 40
        },
        {
            column: 'Salary below 10,000 birr',
            type: Number,
            value: data => data.salaryten,
            width: 40
        },
        {
            column: 'Salary between 10,000 and 20,000 birr',
            type: Number,
            value: data => data.salarytentwenty,
            width: 40
        },
        {
            column: 'Salary above 20,000 birr',
            type: Number,
            value: data => data.salarytwenty,
            width: 40
        },
        {
            column: '# of Tech based occupations',
            type: Number,
            value: data => data.tech,
            width: 40
        },
        {
            column: '# of non-Tech based occupations',
            type: Number,
            value: data => data.nonTech,
            width: 40
        },
        {
            column:'# of Satisfactions at 5',
            type: Number,
            value: data => data.satisfactionFive,
            width: 40
        },
        {
            column: '# of Satisfactions at 4',
            type: Number,
            value: data => data.satisfactionFour,
            width: 40
        },
        {
            column: '# of Satisfactions at 3',
            type: Number,
            value: data => data.satisfactionThree,
            width: 40
        },
        {
            column: '# of Satisfactions at 2',
            type: Number,
            value: data => data.satisfactionTwo,
            width: 40
        },
        {
            column: '# of Satisfactions at 1',
            type: Number,
            value: data => data.satisfactionOne,
            width: 40
        },
        {
            column: '# of occupations attained due to department',
            type: Number,
            value: data => data.attainment,
            width: 40
        },
        {
            column: '# of occupations attained not due to department',
            type: Number,
            value: data => data.nonattainment,
            width: 40
        },
       
        
    ]
      await writeExcel(object,{
        schema,
        filePath: path.join(process.cwd(),`files/${data.file_name}`),
        sheet: `${data.report.batch} Data`,
        
      })

}

module.exports = createExcel