var express			= require('express');
var app				= express();
var bodyParser		= require('body-parser');
var morgan			= require('morgan');
var mysql			= require('node-mysql');
//var jwt				= require('jsonwebtoken');
var path			= require('path');
var passport		= require('passport');


var config			= require('./config');

// set up the app to handle CORS requests and grab POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req,res,next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
	              Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to the database
// will fill in later

// setup the static file directory to make pulling with angular easier
app.use(express.static(__dirname + '/public'));

// route all requests to the angular index.html file
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.on('error', function (err) {
	console.log(config.c.red + 'An error occured:' + config.c.reset + err );
});

process.on('uncaughtException', function (err) {
	console.log(config.c.red + 'Uncaught Exception occured: ' + config.c.reset + err );
	console.log(config.c.yellow + "It is highly likely that the port you have chosen: " + config.c.reset +
		        + config.port + config.c.yellow + " is already in use. \r\n" + 
		        "\x1b[00mPlease select a different port!");
});

// Start the server
app.listen(config.port);
//console.log( config.colors.green + 'The Comet.node server is listening on port: ' + config.port + "\x1b[31m!\x1b[0m");