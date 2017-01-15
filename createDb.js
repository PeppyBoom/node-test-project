var mongoose = require('./libs/mongoose'),
    async    = require('async');

// mongoose.set('debug', true);

async.series([
    open,
    dropDatabase,
    requireModels,
    createUser,
    createIssue
], function (err, results) {
    console.log(arguments);
    mongoose.disconnect();
});

function open(callback)
{
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback)
{
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback)
{
    require('./models/user');
    require('./models/issue');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUser(callback)
{
    var users = [
        {username:'Admin', password:'000000'},
        {username:'User', password:'000000'},
        {username:'User1', password:'000000'}
    ];

    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createIssue(callback)
{
    var issues = [
        {name:'test', solution:'testS', rating:5},
        {name:'test1', solution:'test1S', rating:4},
        {name:'test2', solution:'test2S', rating:3}
    ];

    async.each(issues, function (issueData, callback) {
        var issue = new mongoose.models.Issue(issueData);
        issue.save(callback);
    }, callback);
}