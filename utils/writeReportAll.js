//Require write-excel
const writeExcel = require('write-excel-file/node')

//Require path
const path = require('path')

//Create write excel function
const createExcelAll = async (report,file_name)=>{
    //Create the header and data for the excel sheet
    const HEADER_ROW = [
        {
          value: 'Batch',
          fontWeight: 'bold',
          width: 100
        },
        {
          value: '# of Employed Alumni',
          fontWeight: 'bold',
          width: 100
        },
        {
          value: '# of Unemployed Alumni',
          fontWeight: 'bold',
          width: 100
        },
        {
          value: '# of male Alumni',
          fontWeight: 'bold',
          width: 100
        },
        {
          value: '# of female Alumni',
          fontWeight: 'bold',
          width: 100
        },
        {
          value: 'Salary below 10,000 birr',
          fontWeight: 'bold',
          width: 20
        },
        {
          value: 'Salary between 10,000 and 20,000 birr',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: 'Salary above 20,000 birr',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of Tech based occupations',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of non-Tech based occupations',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of Satisfactions at 5',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of Satisfactions at 4',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of Satisfactions at 3',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of Satisfactions at 2',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of Satisfactions at 1',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of occupations attained due to department',
          fontWeight: 'bold',
          width: 40
        },
        {
          value: '# of occupations attained not due to department',
          fontWeight: 'bold'
        },
      ]
      
      const excelData = [
        HEADER_ROW
      ]

      for(const data of report ){
        const single = [{
            type: String,
            value: data.batch,
        },
        {
            type: Number,
            value: data.employed_count,
        },
        {
            type: Number,
            value: data.unemployed_count
        },
        {
            type: Number,
            value: data.male_graduate_count
        },
        {
            type: Number,
            value: data.female_graduate_count
        },
        {
            type: Number,
            value: data.salary_below_ten_count
        },
        {
            type: Number,
            value: data.salary_below_twenty_count 
        },
        {
            type: Number,
            value: data.salary_above_twenty_count
        },
        {
            type: Number,
            value: data.tech_based_occupation
        },
        {
            type: Number,
            value: data.non_tech_based_occupation 
        },
        {
            type: Number,
            value: data.satisfaction_five_count 
        },
        {
            type: Number,
            value: data.satisfaction_four_count
        },
        {
            type: Number,
            value: data.satisfaction_three_count
        },
        {
            type: Number,
            value: data.satisfaction_two_count
        },
        {
            type: Number,
            value: data.satisfaction_one_count
        },
        {
            type: Number,
            value: data.university_aid_count
        },
        {
            type: Number,
            value: data.non_university_aid_count
        }]

        excelData.push(single)
      }  
      

      const columns = [
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50},
        {width:50}
    ]
    
      await writeExcel(excelData,{
        columns,
        filePath: path.join(process.cwd(),`files/${file_name}`),
        sheet: "All Data",
        
      })

}

module.exports = createExcelAll