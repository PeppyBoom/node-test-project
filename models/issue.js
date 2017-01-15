var mongoose = require('../libs/mongoose'),
    Schema   = mongoose.Schema,
    Issue    = this;

var schema = new Schema({
    name:{
        type:String
    },
    solution:{
        type:String
    },
    rating:{
        type:Number
    }
});

exports.Issue = mongoose.model('Issue', schema);