var issues = require('../models/issue').Issue;

exports.get = function (req, res) {
    res.render('frontpage', {
        issues: issues.find({name:"test"}, function(err, name) {})
    });
};
