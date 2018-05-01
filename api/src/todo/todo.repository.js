const todoModel = require('./todo.model.js');

function create(todo) {
	return todoModel.create(todo);   
}

function getById(id) {
	return todoModel.findById(id);
}

function get(query) {
	return todoModel.find(query);
}

function update(todo) {
	return todoModel.get(todo);  
}

function update(id, todo) {
	return todoModel.update({ _id: id }, todo);
}

function deleteById(id) {
	return todoModel.findByIdAndRemove(id);;   
}

module.exports.create = create;
module.exports.get = get;
module.exports.getById = getById;
module.exports.update = update;
module.exports.deleteById = deleteById;