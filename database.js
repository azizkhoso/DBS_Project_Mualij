let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'dbs_project'
});

connection.once('connect', (err)=>{
    if(err) throw err;
    console.log('Connected');
});

let db = {
    find: function (email, password, table) {
        return new Promise((res, rej)=>{
            let query = `SELECT * FROM ${table} WHERE email='${email}';`;
            console.log('Executing: '+query);
            connection.query(query, (err, result)=>{
                if(err) rej(err.message);
                if(result && result[0].Password===password){
                    res(result[0]);
                }
                else rej('Invalid Password');
            });
        });
    },
    query: function(sql, values){
        return new Promise((resolve, reject)=>{
            if(values){
                console.log('Executing: '+sql+', ['+values+']');
                connection.query(sql, values, function(err, result){
                    if(err) reject(err.message);
                    resolve(result);
                });
            }
            else{
                console.log('Executing: '+sql);
                connection.query(sql, function(err, result){
                    if(err) reject(err.message);
                    resolve(result);
                });
            }
        });
    }
}
module.exports = db;