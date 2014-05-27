var mongoose = require('mongoose');
var Schema = mongoose.Schema;

	var TaskSchema = new Schema({
		text:{type:String},
		complete:{type:Boolean},
		priority:{type:Number}
	});

	var UserSchema = new Schema({
		name:{type:String,required:true,unique:true},
		tasks:[TaskSchema]
	});

module.exports = mongoose.model('User',UserSchema);