const db = require("../utils/database");
const executeQuery = require("../utils/database");


module.exports = {

    createDataBase : (async (databaseName)=>{
        console.log("da", databaseName)
        return executeQuery('school_management', `CREATE DATABASE IF NOT EXISTS 'SFM_${databaseName}'`);
    }),
    insertData: (async (databaseName, table, data) => {
        return executeQuery(databaseName, `insert into ${table} set ?`, [data]);
    }),
    updateData: (async (table, where, data) => {
        return db.query(`update ${table} SET ? ${where}`, [data]);
    }),
    getData: (async (databaseName,table, where) => {
        return executeQuery(databaseName,`select * from ${table} ${where}`);
    }),
    deleteData: (async (table, where) => {
        return db.query(`Delete from ${table} ${where}`);
    }),
    fetchCount: (async (table, where) => {
        return db.query(`select  count(*)
 as total from ${table} ${where}`);
    }),
    //added on  28-06-2022
    getSelectedColumn: (async (table, where, column) => {
        return db.query(`select ${column} from ${table} ${where}`);
    })
}