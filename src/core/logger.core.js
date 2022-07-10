const { model } = require('mongoose');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    defaultMeta: { service: 'livestream-api-service' },
    // transports: [
    //     new transports.File({ filename: 'error.log', level: 'error' }),
    //     new transports.File({ filename: 'combined.log' }),
    // ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}


module.exports = logger