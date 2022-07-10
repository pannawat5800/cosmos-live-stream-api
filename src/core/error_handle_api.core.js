const { NotFoundApi } = require("./response.core");

const errorApiHandler = (error, _, res, next) => {

    // const { statusCode = 500, message = "Something went wrong." } = err;
    res.status(error.code || 500).send(error);
}

const notFoundApiHandler = (req, res) =>  {
    res.status(404).json(new NotFoundApi())
}

module.exports = {
    errorApiHandler,
    notFoundApiHandler
}