// a thank you to Fideloper @ http://fideloper.com/nodejs-event-emitters
// for helping me get this database part off of the ground
// I converted it to pooled for this usage rather than fixed global

var node_mysql 		= require('mysql'),
	EventEmitter 	= require('events').EventEmitter,
	Connection;

function mySql(config) {
	if (!(this instanceof mySql)) return new mySql(config);
	
	this.config = config;	
};

// Creates the event emitter object for the mySql function
mySql.prototype = Object.create(EventEmitter.prototype);

// Defines the setup for the mysql connection
// creates the pool with the passed configuration
// creates a few listeners for errors/connection events
mySql.prototype.init = function() {
	var vm = this;
	
	Connection = node_mysql.createPool( vm.config );
		
	Connection.on('error', vm.handleError);
	
	Connection.on('enqueue', function () {
		console.log('[mySql] Waiting for an available connection slot.');
	});
	
	Connection.on('connection', function (connection) {
		console.log('[mySql] A connection was made to the pool on thread #' + connection.threadId);
	});
	
	process.on('uncaughtException', function (err) {
		console.log('\x1b[31mUncaught Exception occured:\x1b[00m ' + err.message );
		
		if ( err.message === 'listen EADDRINUSE' ) {
			console.log("\x1b[33mIt is highly likely that the port you have chosen:\x1b[00m " +
			        + process.env.PORT + "\x1b[33m is already in use. \r\n" + 
			        "\x1b[00mPlease select a different port!");
		}
		else if ( err.message === 'connect ECONNREFUSED' ) {
			console.error('[PROC] The remote connection was refused.');
		} else {
			//console.error('[PROC] \x1b[31mDetails:\x1b[00m ' + err.stack);
		}
	});
}

// leaving empty for the moment and creating the connections
// within the query functions
// I had trouble pulling the connection from here when using pooled
mySql.prototype.connect = function() {
	// not needed at the moment
}

// sort of an event handler for the mySql function
// translates a few of the error messages
// may expand on this later
/*
* params {object} err // passed as an error from another event
*
*/
mySql.prototype.handleError = function (err) {
	var vm = this;
	
	if (err) {
		vm.connected = false;
		
		if ( err.code === 'PROTOCOL_CONNECTION_LOST' ) {
			Connection.removeListener('error', vm.handleError);
			Connection = null;
			console.error('[mySql] The connection was lost, recreating the connection.');
			return vm.init();
		}
	
		if ( /ER_BAD_DB_ERROR/.test(err.code) ) {		
			console.error('[mySql] The database in your config does not exist');
			console.log('[mySql] Please re-enter the information and re-run your application.')
			process.exit(1);
		}
		
		if ( /ECONNREFUSED/.test(err.code) ) {
			console.error('[mySql] Your MYSQL connection was refused, please make sure the server is active.');
		}
		
		console.error('[mySql]' + err.message);
		vm.emit('error', err);
	}
}

mySql.prototype.verifyResult = function(result) {
	return ( result !== null && result !== undefined );
}
// pushes a query to the database to get all of the tickets from the database
/*
* param {object} cb // returns the async response as either err or result
*/
mySql.prototype.getAllTickets = function(cb) {
	var vm = this;
	
	Connection.getConnection(function (err, connection) {
		if ( !connection || err) {
			vm.handleError(err);
		}
			
		console.log('[mySql] Connected to the database on thread #' + connection.threadId);
		connection.query('CALL getTickets()', function (err, rows) {
			connection.release();
			
			if (err) {
				cb(err);
			}

			console.log('[mySql] getAllTickets query successful!');
			vm.emit('get');
			cb(null, rows[0]);
		});
		
		// getTickets() sql procedure
		/**
		* CREATE DEFINER=`root`@`localhost` 
		* PROCEDURE `getActiveTickets`() 
		* DETERMINISTIC 
		* READS SQL DATA 
		* SQL SECURITY DEFINER 
		* SELECT id, status, date, updated, companyname, indicator_tag, indicator_model, indicator_serial 
		* FROM scales 
		* WHERE status = 'Pending' OR status = 'Diagnosed' OR status = 'Repaired' OR status = 'Waiting for Parts' OR status = 'Waiting for Customer' 
		* ORDER BY id ASC, date ASC, companyname ASC
		**/
	});
}

// pushes a query to the database to get all of the -active- tickets from the database
/*
* param {object} cb // returns the async response as either err or result
*/
mySql.prototype.getActiveTickets = function (cb) {
	var vm = this;
	
	Connection.getConnection(function (err, connection) {
		if (!connection || err) {
			vm.handleError(err);
		} 	
		
		console.log('[mySql] Connected to the database on thread #' + connection.threadId);
		connection.query('CALL getActiveTickets()', function (err, rows) {
			connection.release();
			if (err) {
				cb(err);
			}
			
			console.log('[MYSQL] getActiveTickets query successful!');
			vm.emit('get');
			
			if ( vm.verifyResult(rows[0]) ) {
				cb(null, rows[0]);
			} else {
				cb(null, {
					success: false,
					message: 'No tickets were found that matched your query'
				});
			}
		});
		
		// sql procedure
		/** 
		* CREATE DEFINER=`root`@`localhost` 
		* PROCEDURE `getTickets`() 
		* DETERMINISTIC 
		* READS SQL DATA 
		* SQL SECURITY DEFINER 
		* SELECT id, status, date, updated, companyname, indicator_tag, indicator_model, indicator_serial 
		* FROM scales 
		* ORDER BY id ASC, date ASC, companyname ASC
		**/
	});
}

// pushes a query to the database to get the ticket that matches the requested id
/*
* param {integer} id // integer id passed as a search variable in the sql query
* param {object} cb // returns the async response as either err or result
*/
mySql.prototype.getTicketById = function (id, cb) {
	var vm = this;
	
	Connection.getConnection(function (err, connection) {
		if (!connection || err) {
			vm.handleError(err);
		} 	
		
		console.log('[mySql] Connected to the database on thread #' + connection.threadId);
		connection.query('CALL getTicketById(' + id + ')', function (err, rows) {
			connection.release();
			if (err) {
				cb(err);
			}
			
			console.log('[MYSQL] getTicketById query successful with id #' + id);
			vm.emit('get');
			
			if ( /[A-Za-z0-9]+/.test(rows[0]) ) {
				cb(null, rows[0]);
			} else {
				cb(null, {
					success  : false,
					id 		 : id, 
					message  : 'No tickets were found that matched your query'
				});
			}
		});
		
		// sql procedure
		/**
		* CREATE DEFINER=`root`@`localhost` 
		* PROCEDURE `getTicket`(IN `in_id` INT) 
		* DETERMINISTIC 
		* READS SQL DATA 
		* SQL SECURITY DEFINER 
		* SELECT * FROM scales 
		* WHERE id = in_id 
		* ORDER BY id ASC, date ASC, companyname ASC
		**/
	});
}

mySql.prototype.getAllUsers = function (cb) {
	var vm = this;
	
	Connection.getConnection(function (err, connection) {
		if (!connection || err) {
			vm.handleError(err);
		} 	
		
		console.log('[mySql] Connected to the database on thread #' + connection.threadId);
		connection.query('CALL getUsers()', function (err, rows) {
			connection.release();
			if (err) {
				cb(err);
			}
			
			console.log('[MYSQL] getAllUsers query successful!');
			vm.emit('get');
			cb(null, rows[0]);
		});
		
		// sql procedure
		/**
		* CREATE DEFINER=`root`@`localhost` 
		* PROCEDURE `getUsers`() 
		* DETERMINISTIC 
		* READS SQL DATA 
		* SQL SECURITY DEFINER 
		* SELECT id, username, fullname, email 
		* FROM users 
		* ORDER BY username ASC, fullname ASC
		**/
	});
}

mySql.prototype.getUserById = function (id, cb) {
	var vm = this;
	
	Connection.getConnection(function (err, connection) {
		if (!connection || err) {
			vm.handleError(err);
		} 	
		
		console.log('[mySql] Connected to the database on thread #' + connection.threadId);
		connection.query('CALL getUserById(' + id + ')', function (err, rows) {
			connection.release();
			if (err) {
				cb(err);
			}
			
			console.log('[MYSQL] getAllUsers query successful!');
			vm.emit('get');
			if ( /[A-Za-z0-9]+/.test(rows[0]) ) {
				cb(null, rows[0]);
			} else {
				cb(null, {
					success  : false,
					id 		 : id, 
					message  : 'No users were found that matched your query'
				});
			}
		});
		
		// sql procedure
		/**
		* CREATE DEFINER=`root`@`localhost` 
		* PROCEDURE `getUserById`(IN `userId` INT(10)) 
		* DETERMINISTIC 
		* READS SQL DATA 
		* SQL SECURITY DEFINER 
		* SELECT id, username, fullname, email 
		* FROM users 
		* WHERE id = userId
		**/
	});
}

module.exports = mySql;
