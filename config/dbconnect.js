const mysql = require('mysql2');
const USER = 'shiva_a';
const PWD = 'Cl0udev0lve12!';
const DATABASE = 'cloudevolve_app';
const DB_HOST_NAME = '172.16.4.245';
const MAX_POOL_SIZE = 100;
const MySQLConPool = mysql.createPool({
    host: DB_HOST_NAME,
    user: USER,
    password: PWD,
    port:"3306",
    database: DATABASE,
    connectTimeout: 20000,
    connectionLimit: MAX_POOL_SIZE,
    debug: false,
    multipleStatements: true
});

exports.MySQLConPool = MySQLConPool;
