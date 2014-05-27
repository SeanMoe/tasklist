var mongoose = require('mongoose');
var Schema = mongoose.Schema;

	var TaskSchema = new Schema({
		text:{type:String},
		complete:{type:Boolean},
		priority:{type:Number}
	});

module.exports = mongoose.model('Task',TaskSchema);