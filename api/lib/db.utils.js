
const mongoose = require('mongoose');
const Promise = require('bluebird');
const DB_URI = `${ process.env.TODO_DB_HOSTNAME }/${ process.env.TODO_DB_NAME }`;

const TodoModel = require('../src/todo/todo.model');

function clearCollections(done) {
    var promises = [
        TodoModel.remove().exec()
    ];

    Promise.all(promises)
        .then(function () {
            done();
        });
}
	
function clearDB(done) {
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(DB_URI, function (err) {
            if (err) {
                throw err;
            }
            return clearCollections(done);
        });
    } else {
        return clearCollections(done);
    }	
} 

exports.clearDB = clearDB;
