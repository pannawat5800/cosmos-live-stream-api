const express = require('express')
const mongoose = require('mongoose');
const { dbUrl, dbName, dbUsername, dbPass, port} = require('./core/config.core');
const logger = require('./core/logger.core');
const { errorApiHandler, notFoundApiHandler } = require('./core/error_handle_api.core')
const cors = require('cors')
const app = express()

const ApiRouter = require('./routes/index.route')

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/live_api', ApiRouter)


// app.use('*', notFoundApiHandler);
app.use(errorApiHandler);

async function main() {
    try {
        logger.info('start connect to db')
        await mongoose.connect(dbUrl, {
            dbName: dbName,
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        logger.info('start server')
        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    } catch(error) {
        console.log(error)
        logger.error(error)
    }
}

main()
