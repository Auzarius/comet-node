var express		= require('express'),
	app			= express(),
	bodyParser	= require('body-parser'),
	morgan		= require('morgan'),
	mysql		= require('mysql'),
	path		= require('path');

var config		= require('./config'),
	mySql 		= require('./comet-node/models/mySql-pooled')(config.db);

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
mySql.init();

// setup the static file directory to make pulling with angular easier
app.use(express.static(__dirname + '/public'));

// route all requests to the angular index.html file
var apiRoutes  = require('./comet-node/routes/api')(app, express, mySql);
var apiUsers   = require('./comet-node/routes/users')(app, express, mySql);
var apiTickets = require('./comet-node/routes/tickets')(app, express, mySql);
app.use('/api', apiRoutes);
app.use('/api/users', apiUsers);
app.use('/api/tickets', apiTickets);

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.on('error', function (err) {
	console.log(config.c.red + 'An error occured:' + config.c.reset + err );
});
		
// Start the server
app.listen(config.port);
console.log( config.c.green + 'The Comet.node server is listening on port: ' + config.port + "\x1b[31m!\x1b[0m");