/**
 * Module dependencies.
 */

var express   = require('express'),
    http      = require('http'),
    path      = require('path'),
    config    = require('./config'),
    log       = require('./libs/log')(module),
    mongoose  = require('./libs/mongoose'),
    HttpError = require('./error').HttpError;

var app = express();
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
if ('development' == app.get('env')) {
    app.use(express.logger('dev'));
} else {
    app.use(express.logger('default'));
}

app.use(express.bodyParser());
app.use(express.cookieParser());

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
    secret:config.get("session:secret"),
    key:config.get("session:key"),
    cookie:config.get("session:cookie"),
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));

// app.use(function (req, res, next) {
//     req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//     res.send("Visits: " + req.session.numberOfVisits);
// });

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
app.use(app.router);

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});

app.use(function (err, req, res, next) {
    if ('number' == typeof err) {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if ('development' == app.get('env')) {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});