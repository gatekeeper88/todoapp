const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const ejs = require('ejs');

const PORT = process.env.TODO_CLIENT_PORT || 5000;
const TODO_API_URL = `${ process.env.TODO_API_HOSTNAME }:${ process.env.TODO_API_PORT }`;

if (!TODO_API_URL) {
	throw new Error('Invalid db todo app API url: ' + TODO_API_URL)	
}

function createServer() {	
	app.use(express.static(path.join(__dirname, 'public')));

	return app;
}
var indexFile = "";

var config = {
	environment: process.env.NODE_ENV,
	api: {
		protocolPrefix: 'http',
		url: TODO_API_URL
	}
};

app.get( '/', ( req, res ) => {
	res
	.set( 'Content-Type', 'text/html' )
	.status( 200 )
	.send( indexFile );
});


ejs.renderFile(path.join( __dirname, 'public', 'index.html' ), { config }, { delimiter: '$' }, ( err, file ) => {
	if ( err ) {
		console.error( 'Error rendering index.html file:', err );

		return;
	}
	indexFile = file;
	
	createServer().listen(PORT, function(){
		console.info('Server listening on port ' + PORT);
	});
})