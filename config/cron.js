// var winston = require('winston');
global.fs = require('fs');//Importing File stream Module 

const winston= require('winston');
require('winston-daily-rotate-file');
const { combine, colorize, label, printf, splat, timestamp, align } = winston.format;
const cronDir = 'cronLogs';
const myFormat1 = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
var cron = winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'info',
            filename: `${cronDir}/Cron_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            handleExceptions: true,
            json: true,
            // maxsize: 5242880, //5MB
            // maxFiles: 5,
            colorize: false,
            timestamp:true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: false
        })
    ],
    exitOnError: false,
    format: combine(
        splat(),
        colorize(),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        align(),
        myFormat1
    )
});

module.exports = cron;
module.exports.stream = {
    write: function (message, encoding) {
        cron.info(message);
    }
};
