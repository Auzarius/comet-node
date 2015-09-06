
var node_mysql 		= require('mysql'),
	bcrypt  		= require('bcrypt-nodejs'),
	Connection;

module.exports = function(config) {
	
	var mySql = this;
	//if (!(this instanceof mySql)) return new mySql(config);
	mySql.config = config;
	
	mySql.init = function() {
		var vm = this;
		console.log('[mySql] The function has been initialized.');
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
				console.error('[PROC] \x1b[31mDetails:\x1b[00m ' + err.stack);
			}
		});
	}
	
	mySql.handleError = function (err) {
		var vm = this;
	
		if (err) {
			vm.connected = false;
			
			if ( err.code === 'PROTOCOL_CONNECTION_LOST' ) {
				Connection.removeListener('error', vm.handleError);
				Connection = null;
				console.error('[mySql] The connection was lost, recreating the connection.');
				return vm.init();
			}
		
			else if ( /ER_BAD_DB_ERROR/.test(err.code) ) {		
				console.error('[mySql] The database in your config does not exist');
				console.log('[mySql] Please re-enter the information and re-run your application.')
				process.exit(1);
			}
			
			else if ( /ECONNREFUSED/.test(err.code) ) {
				console.error('[mySql] Your MYSQL connection was refused, please make sure the server is active.');
			}
			
			else {
				console.error('[mySql]' + err.message);
			}
		}
	}
	
	mySql.verifyResult = function(result) {
		return ( result !== null && result !== undefined && /[A-Za-z0-9]+/.test(result) );
	}
	
	
	mySql.tickets = {
		active : function (cb) {
	
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('CALL getActiveTickets()', function (err, rows) {
					connection.release();
					if (err) {
						cb(err);
					}
					
					console.log('[MYSQL] getActiveTickets query successful!');
					
					if ( mySql.verifyResult(rows[0]) ) {
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
		},
		
		all : function (cb) {
	
			Connection.getConnection(function (err, connection) {
				if ( !connection || err) {
					mySql.handleError(err);
				}
					
				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('CALL getTickets()', function (err, rows) {
					connection.release();
					
					if (err) {
						cb(err);
					}

					console.log('[mySql] getAllTickets query successful!');
					if ( mySql.verifyResult(rows[0]) ) {
						cb(null, rows[0]);
					} else {
						cb(null, {
							success: false,
							message: 'No tickets were found that matched your query'
						});
					}
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
		},
		
		findOne : function (options, cb) {
	
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('SELECT * FROM tickets WHERE ?', options, function (err, rows) {
					connection.release();
					if (err) {
						cb(err);
					}
					
					console.log('[MYSQL] getTicketById query successful with options : ' + options);
					
					if ( /[A-Za-z0-9]+/.test(rows[0]) && rows[0] !== undefined ) {
						cb(null, rows[0]);
					} else {
						cb(null, {
							success  : false,
							options	 : options,
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
		},
		
		create : function (ticket, cb) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('INSERT INTO tickets VALUES ?', ticket, function (err, result) {
					if (err) {
						cb(err);
					} else { 
						cb(null, result);
					}
				});
			});
		}
	}
	
	mySql.users = {
		all : function (cb) {
			
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('CALL getUsers()', function (err, rows) {
					connection.release();
					if (err) {
						cb(err);
					}
					
					console.log('[MYSQL] getAllUsers query successful!');
					cb(null, rows[0]);
				});
				
				// sql procedure
				/**
				* CREATE DEFINER=`root`@`localhost` 
				* PROCEDURE `getUsers`() 
				* DETERMINISTIC 
				* READS SQL DATA 
				* SQL SECURITY DEFINER 
				* SELECT id, username, name, email 
				* FROM users 
				* ORDER BY username ASC, name ASC
				**/
			});
		},
		
		findOne : function (options, cb) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('SELECT id, username, password, salt, name, email FROM users WHERE ?', options, function (err, rows) {
					connection.release();
					if (err) {
						cb(err);
					}
					
					console.log('[MYSQL] findOne query successful!');
					
					if ( rows[0] !== undefined ) {
						console.log(rows[0]);
						cb(null, rows[0]);
					} else {
						console.log('failed');
						cb({
							success  : false,
							message  : 'No users were found that matched your query'
						});
					}
				});
				
				// sql procedure
				/**
				* CREATE DEFINER=`root`@`localhost` 
				* PROCEDURE `getUserByUsername`(IN `_username` VARCHAR(30)) 
				* NOT DETERMINISTIC 
				* READS SQL DATA 
				* SQL SECURITY DEFINER 
				* SELECT id, username, name, email 
				* FROM users 
				* WHERE username = _username
				**/
			});
		},
		
		create : function (user, cb) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				

				data = [];
				data.push("'" + user.name + "'");
				data.push("'" + user.username + "'");
				data.push("'" + user.password + "'");
				data.push("'" + user.salt + "'");
				data.push("'" + user.email + "'");
				data.push("'" + user.created_by + "'");

				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('INSERT INTO users (name, username, password, salt, email, created_by) VALUES ( ' + data.join(', ') + ' )', function (err, rows) {
				    
				    connection.release();
				    if (err) {
				    	cb(err);
				    } else {
				    	cb(null, {
				    		success: true,
				    		message: 'The user was successfully created!'
				    	});
				    }
                });
			});
		},
		
		save : function (user, cb) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				/* 'username = ' + user.username + ', ' +
				                 'password = ' + user.password + ', ' +
				                 'name = '     + user.name + ', ' +
				                 'email = '	   + user.email	   + ', ' +
				                 'WHERE id = ' + user.id + ' )' */
				console.log(user);
				console.log('[mySql] Connected to the database on thread #' + connection.threadId);
				connection.query('UPDATE users SET ?', user, function (err, result) {
				                 
				    if (err) {
				    	cb(err);
				    } else {
				    	cb(null, {
				    		success: true,
				    		message: 'The user was successfully updated!'
				    	});
				    }
				    
				    
                });
			});	
		},
		
		remove : function (userId, cb) {
			
			if ( typeof userId === int ) {
				Connection.getConnection(function (err, connection) {
					if (!connection || err) {
						mySql.handleError(err);
					} 	
					
					console.log('[mySql] Connected to the database on thread #' + connection.threadId);
					connection.query('DELETE FROM users WHERE id = ?', userId, function (err, result) {
						if (err) {
							cb(err);
						}
						
						cb(null);
					});
				});
			} else {
				cb({
					success: false,
					message: 'Expecting type int but received something else',
					type   : typeof userId,
					value  : userId
				});
			}
		},
		
		hashPassword : function (password, cb) {
			bcrypt.genSalt(12, function (err, salt) {
				if (err) 
					cb(err);
				
				if (salt) {
					bcrypt.hash(password, salt, null, function (err, result) {
						if (err)
							cb(err);
						
						if (result) {
							cb(null, {
								salt: salt,
								pass: result
							});
						} else {
							cb(null, {
								success: false,
								message: 'Something went wrong when generating the final hash.',
								result : result
							});
						}
					});
				} else {
					cb(null, {
						success: false,
						message: 'Something went wrong when creating the salt.',
						result : salt
					});
				}			
			});
		},
		
		hashLogin : function ( User, cb) {
			mySql.users.findOne({ username: User.username }, function (err, user) {
				if (err) {
					cb(err);
				} else {
					
					if (!user) {
						cb({
							success: false,
							message: 'Getting the user information failed during password comparison'
						});
					} else {
						bcrypt.hash(User.password, user.salt, function (err, result) {
							if (err)
								cb(err);
							
							if (result) {
								cb(null, {
									salt: salt,
									pass: result
								});
							} else {
								cb(null, {
									success: false,
									message: 'Something went wrong when generating the final hash.',
									result : result
								});
							}
						});
					}
				}
			});
		}
	}
	
	mySql.bcrypt = bcrypt;

	return mySql;
}
