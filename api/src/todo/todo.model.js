const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
	name : {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum : ['PENDING','COMPLETED'],
        default: 'PENDING'
	},
	dueDate: {
		type: Date,
		required: true
	}
},{ versionKey: false });

Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;