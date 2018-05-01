const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.TODO_API_PORT || 3000; 

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const app = express()
const todoRoutes = require('./src/todo/todo.routes.js');

function createServer() {	
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors())

  app.use( '/api', todoRoutes.router );

  return app;
}

function connectDb() {
	const DB_HOSTNAME = process.env.TODO_DB_HOSTNAME;
	const DB_NAME = process.env.TODO_DB_NAME;

	if (!DB_HOSTNAME) {
		throw new Error('Invalid db hostname: ' + DB_HOSTNAME)	
	}

	if (!DB_NAME) {
		throw new Error('Invalid db name: ' + DB_NAME)	
	}
	const DB_URI = `${ DB_HOSTNAME }/${ DB_NAME }`;
	console.info('Connecting to db:' + DB_URI)
	
  return mongoose.connect(DB_URI);   
}

connectDb().then(() => {
	console.info('Database connection is open');	
	createServer().listen(PORT, server => {
    	console.info('Server is running at port ' + PORT);   
	});
}).catch(err => {
	console.error('Database connection err', err)
});

module.exports = app;
