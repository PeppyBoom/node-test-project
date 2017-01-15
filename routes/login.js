var User      = require('../models/user').User,
    HttpError = require('../error').HttpError,
    AuthError = require('../models/user').AuthError,
    async     = require('async');

exports.get = function (req, res) {
    res.render('login');
};

exports.post = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.send({});
    });

    // User.findOne({username:username}, function (err, user) {
    //     if (err) return next(err);
    //
    //     if (user) {
    //         if (user.checkPassword(password)) {
    //
    //         } else {
    //
    //         }
    //     } else {
    //         var user = new User({username:username, password:password});
    //         user.save(function (err) {
    //             if (err) return next(err);
    //         });
    //     }
    // });
};
