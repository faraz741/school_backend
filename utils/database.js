// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'school_management'
// });


// connection.connect((err) => {
//     if (err) {
//         console.log('Cannot be connect to Database due to', err);
//     } else {
//         console.log("Connected to mysql Server!");
//     }
// });


// const utill = require('util');

// function makeDb() {
//     return {
//         query(sql, args) {
//             // console.log("db connected localhost");
//             // console.log(sql);
//             return utill.promisify(connection.query)
//                 .call(connection, sql, args);
//         },
//         close() {
//             console.log("db not connected to localhost");
//             return utill.promisify(connection.end).call(connection);
//         }
//     }
// }
// const db = makeDb();
// module.exports = db;


const mysql = require('mysql2');

// Function to execute a query on a specific database
function executeQuery(databaseName, sqlQuery, args) {
   
    // Define database connection configuration
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: databaseName // Use the dynamic database name
    };

    // Create connection to the specified database
    const connection = mysql.createConnection(dbConfig);

    // Connect to the database
    connection.connect((err) => {
        if (err) {
            console.error(`Error connecting to database ${databaseName}:`, err);
            return;
        }
        console.log(`Connected to database ${databaseName}`);

        // Execute the SQL query
        connection.query(sqlQuery,args, (err, results) => {
            console.log(sqlQuery)
            if (err) {
                console.error(`Error executing query on database ${databaseName}:`, err);
                return;
            }
            console.log(`Results from database ${databaseName}:`, results);
        });

        // Close connection after the query is executed
        connection.end();
    });
}



module.exports = executeQuery;

