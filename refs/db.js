
module.exports = function(MySQL) {
	
	var vm = this;
	vm.pool = null;
	vm.connection = null;
	
	vm.init = function() {
		console.log('[MYSQL] Creating the pool [hopefully once]');
		var pool = MySQL.createPool({
			connectionLimit	: 50,
			host     		: 'localhost',
			user     		: 'root',
			password 		: '',
			database 		: 'brechbuhler_test'
		});
		
		return pool;
	};
	
	pool = vm.init();
	
	vm.connect = function() {
		pool.getConnection( function (err, connection) {
			if (!connection) {
				console.error('[MYSQL] Failed to establish a connection to the database.');
				console.error('ERR MSG: ' + err.message)
				
				if ( /ER_BAD_DB_ERROR/.test(err) ) {
					console.error('bad db bro');
				}
				
				return vm.init();
			} 
			else if (err) {
				console.error('[MYSQL] An error occured: ' + err.stack +
				              config.c.red + 'Condensed' + err );
				return;
			}
			
			console.log('[MYSQL] Connected to the database on thread ' + connection.threadId + '!');
			vm.connection = connection;
		});
	};
	
	connect(function (connection) {
		if ( connection ) {
			connection.release();
		}
	});
	
	vm.getAllTickets = function() {
		
		connect();
		
		if ( !connection ) {
			return ({ 
				success: false,
				message: 'Failed to connect to the database.'
			});
		} 
		
		connection.query('CALL getTickets()', function (err, rows) {
			if (err) {
				console.error(err.message);
				return ({ 
					success: false,
					message: 'Failed to query the database for the tickets.',
					error  : err.message
				});
			}
			
			//console.log(rows[0]);
			console.log('[MYSQL] getAllTickets query successful!');
			connection.release();
			console.log( rows[0] !== null );
			return rows[0];
		});
			
	};
	
	vm.getActiveTickets = function () {
		pool.getConnection(function (err, connection) {
			if (!connection) {
				console.error('[MYSQL] Failed to establish a connection to the database.');
				
				return;
			} 
			else if (err) {
				console.error('[MYSQL] An error occured: ' + err.stack +
				              config.c.red + 'Condensed' + err );
				return;
			}
			
			
			console.log('[MYSQL] Connected to the database on thread: ' + connection.threadId);
			connection.query('CALL getActiveTickets()', function (err, rows) {
				if (err) throw err;
				
				console.log(rows[0]);
				connection.release();
			});
		});
	}
	
	pool.on('enqueue', function () {
		console.log('[MYSQL] Waiting for an available connection slot.');
	});
	
	pool.on('connection', function (connection) {
		console.log('[MYSQL] A connection was made to the pool.');
	});
	
	pool.on('error', function () {
		console.log('[MYSQL] An error occured, reconnecting to the pool.');
		vm.pool = MySQL.createPool({
			connectionLimit	: 50,
			host     		: 'localhost',
			user     		: 'root',
			password 		: '',
			database 		: 'brechbuhler_test'
		});
	});
	
	/* // closes all connections in the pool
	pool.end(function (err) {
		// all connections in the pool have ended
	});
	*/
	// Once pool.end() has been called, pool.getConnection 
	// and other operations can no longer be performed
	
	return vm;
};
