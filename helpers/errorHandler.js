const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Requested Resource Not Found (404)'
    }).end();
};

const internalServerError = (err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    }).end();
}

module.exports = {
    notFound, 
    internalServerError
}
