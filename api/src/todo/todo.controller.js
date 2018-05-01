const repository = require('./todo.repository.js');
const dateUtils = require('../../lib/date.utils.js');

function createTodo(todo) {
	if (!todo.dueDate || typeof todo.dueDate !== 'string') {
		throw new Error('Due date field is missing or not string');
	}

	var dueDate = new Date(Date.parse(todo.dueDate));
	var endOfDayDueDate = dateUtils.getEndOfDay(dueDate);

	todo.dueDate = endOfDayDueDate.toISOString();
	
	return repository.create(todo);   
}

function getTodos(filter) {
	if (filter.dueDate) {
		var dueDate = filter.dueDate;
		var dueDateValue = dueDate.eq || dueDate.gt || dueDate.lt;

		if (!dueDateValue || typeof dueDateValue !== 'string') {
			throw new Error('Missing dueDate value, cannot filter todos');
		}	

		dueDateValue = new Date(Date.parse(dueDateValue));
		var endOfDueDate = dateUtils.getEndOfDay(dueDateValue);	
		var dbQuery;
		
		if (dueDate.eq) {
			dbQuery = { dueDate: { $eq: endOfDueDate }, status: "PENDING" }; // convert filter to db specific query
		} else
		if (dueDate.gt) {
			dbQuery = { dueDate: { $gt: endOfDueDate }, status: "PENDING" }; // convert filter to db specific query
		} else 
		if (dueDate.lt) {
			dbQuery = { dueDate: { $lt: endOfDueDate }, status: "PENDING" }; // convert filter to db specific query
		}

		return repository.get(dbQuery) 
	}
	
	return repository.get(filter);
}


function getTodoById(id) {
	return repository.getById(id)
}

function updateTodo(id, todo) {
	return repository.update(id, todo)
	.then(() => {
		return repository.getById(id);
	});   
}

function deleteTodo(id) {
	return repository.deleteById(id);
}

module.exports.createTodo = createTodo;
module.exports.getTodos = getTodos;
module.exports.getTodoById = getTodoById;
module.exports.updateTodo = updateTodo;
module.exports.deleteTodo = deleteTodo;
