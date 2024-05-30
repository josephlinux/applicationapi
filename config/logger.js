
const winston = require('winston');
require('winston-daily-rotate-file');
const { combine, colorize, label, printf, splat, timestamp, align } = winston.format;
const logDir = 'logs';
const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

let logger = winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            level: `debug`,
            filename: `${logDir}/ReqRes_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 35,
            colorize: false,
            timestamp:true
        })
        ,
        new winston.transports.Console({
            level: `debug`,
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
        myFormat
    )
});


module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};