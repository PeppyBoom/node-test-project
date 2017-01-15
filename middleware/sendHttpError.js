module.exports = function (req, res, next) {
    res.sendHttpError = function (error) {
        res.status(error.status);
        if ('XMLHttpRequest' == res.req.headers['x-requested-with']) {
            res.json(error);
        } else {
            res.render("error", {error:error});
        }
    };

    next();
};
