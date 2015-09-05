var express		= require('express'),
	app			= express(),
	bodyParser	= require('body-parser'),
	morgan		= require('morgan'),
	mysql		= require('mysql'),
	jwt		= require('jsonwebtoken'),
	path		= require('path');

var config		= require('./config'),
	//database 	= require('./comet-node/models/db')(mysql);
	//db		= require('./comet-node/models/db')(mysql);
	mySql 		= require('./comet-node/models/mySql-pooled');
	db 			= new mySql(config.db);

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
db.init();

// setup the static file directory to make pulling with angular easier
app.use(express.static(__dirname + '/public'));

// route all requests to the angular index.html file
app.get('/all', function (req, res) {
	//res.sendFile(path.join(__dirname + '/public/index.html'));
	db.getAllTickets(function (err, result) {
		if (err) {
			res.json({
				success : false,
				message : 'getAllTickets query failed'
			});
		}
		
		res.json(result);
	});	
});

app.get('/active', function (req, res) {
	//res.sendFile(path.join(__dirname + '/public/index.html'));
	db.getActiveTickets(function (err, result) {
		if (err) {
			res.json({
				success : false,
				message : 'getActiveTickets query failed'
			});
		}
		
		res.json(result);
	});
});

app.get('/ticket/:id', function (req, res) {
	var ticketId = req.params.id;
	db.getTicketById(ticketId, function (err, result) {
		if (err) {
			res.json({
				success : false,
				message : 'getTicket query failed on id:' + ticketId
			});
		}
			
		res.json(result);
	});
});

app.get('/users', function (req, res) {
	db.getAllUsers(function (err, result) {
		if (err) {
			res.json({
				success : false,
				message : 'getTicket query failed on id:' + ticketId
			});
		}
			
		res.json(result);
	});
});

app.get('/user/:id', function (req, res) {
	var userId = req.params.id;
	db.getUserById(userId, function (err, result) {
		if (err) {
			res.json({
				success : false,
				message : 'getTicket query failed on id:' + ticketId
			});
		}
			
		res.json(result);
	});
});

app.on('error', function (err) {
	console.log(config.c.red + 'An error occured:' + config.c.reset + err );
});
		
// Start the server
app.listen(config.port);
//console.log( config.colors.green + 'The Comet.node server is listening on port: ' + config.port + "\x1b[31m!\x1b[0m");