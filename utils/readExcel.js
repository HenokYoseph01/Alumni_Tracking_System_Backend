//Require read excel
const readExcel = require('read-excel-file/node')

const examineExcel = async(pathName)=>{
    const list = await readExcel(pathName)
    return list;
}

module.exports = examineExcel;