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
			console.log('active query');
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
			
				connection.query('SELECT t.id, t.status, t.companyname, t.indicator_tag, t.indicator_manu, t.indicator_model, t.created_at, t.updated_at, ' +
				                 '( SELECT firstName FROM users WHERE id = t.created_by ) AS created_by, ' +
				                 '( SELECT firstName FROM users WHERE id = t.updated_by ) AS updated_by FROM ' + mySql.config.tickets_table + ' t ' +
				                 'WHERE t.status = \'Pending\' OR t.status = \'Diagnosed\' OR t.status = \'Repaired\' ' +
				                 'ORDER BY t.companyname ASC, t.status ASC, t.indicator_tag ASC ', function (err, rows) {
					
					connection.release();
					if (err) {
						cb(err);
					}
					else if ( mySql.verifyResult(rows) ) {
						cb(null, rows);
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
					
				connection.query('CALL getTickets()', function (err, rows) {
					
					connection.release();
					if (err) {
						cb(err);
					}

					//console.log('[mySql] getAllTickets query successful!');
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
				
				connection.query('SELECT * FROM ' + mySql.config.tickets_table + ' WHERE ?', options, function (err, rows) {
					connection.release();
					if (err) {
						cb(err);
					}
					
					//console.log('[MYSQL] getTicketById query successful with options : ' + options);
					
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
			});
		},
		
		create : function (ticket, cb) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
			
				connection.query('INSERT INTO ' + mySql.config.tickets_table + ' SET ?', ticket, function (err, result) {
					
					connection.release();
					if (err) {
						cb(err);
					} else { 
						cb(null, result);
					}
				});
			});
		},
		
		save : function (ticket, cb) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				connection.query('SELECT id FROM ' + mySql.config.tickets_table + ' WHERE ?', { id: ticket.id }, function (err, exists) {
					if (err) {
						connection.release();
						cb(err);
					} else if (exists && exists !== undefined) {
						connection.query('UPDATE tickets SET ?', ticket, function (err, result) {
							
							connection.release();
							if (err) {
								cb(err);
							} else {
								cb(null, {
									success: true,
									message: 'The ticket was successfully updated!'
								});
							}
						});
					} else {
						connection.release();
						cb(null, exists);
					}
				});
			});
		},
		
		setTicket : function (method, req) {
			var Ticket = {};
			
			Ticket.status = req.body.status ? req.body.status : 'Pending';
			
			if ( req.body.companyname )
				Ticket.companyname = req.body.companyname;
			
			if ( req.body.street ) 
				Ticket.street = req.body.street;
			
			if ( req.body.city ) 
				Ticket.city = req.body.city;
			
			if ( req.body.state ) 
				Ticket.state = req.body.state;
			
			if ( req.body.zipcode )
				Ticket.zipcode = req.body.zipcode;
			
			if ( req.body.indicator_tag ) 
				Ticket.indicator_tag = req.body.indicator_tag;
			
			if ( req.body.indicator_manu ) 
				Ticket.indicator_manu = req.body.indicator_manu;
			
			if ( req.body.indicator_model )
				Ticket.indicator_model = req.body.indicator_model;
			
			if ( req.body.indicator_serial ) 
				Ticket.indicator_serial = req.body.indicator_serial;
			
			if ( req.body.scale_manu ) 
				Ticket.scale_manu = req.body.scale_manu;
			
			if ( req.body.scale_model )
				Ticket.scale_model = req.body.scale_model;
			
			if ( req.body.scale_serial )
				Ticket.scale_serial = req.body.scale_serial;
			
			if ( req.body.scale_capacity ) 
				Ticket.scale_capacity = req.body.scale_capacity;
			
			if ( req.body.scale_divisions ) 
				Ticket.scale_divisions = req.body.scale_divisions;
			
			if ( req.body.units && /^(lb|kg|g|oz)$/m.test(req.body.units) ) {
				Ticket.units = req.body.units;
			} else {
				Ticket.units = 'lb';
			}
			
			if ( method == 'create' )
				Ticket.created_by = req.decoded.id;
			
			if ( method == 'save' )
				Ticket.updated_by = req.decoded.id;
			/*
				status			: 'Pending',
				companyname		: req.body.companyname ? req.body.companyname
				street			: req.body.street,
				city 			: req.body.city,
				state 			: req.body.state,
				zipcode			: req.body.zipcode,
				indicator_tag	: req.body.indicator_tag,
				indicator_manu	: req.body.indicator_manu,
				indicator_model	: req.body.indicator_model,
				indicator_serial: req.body.indicator_serial,
				scale_manu		: req.body.scale_manu,
				scale_model		: req.body.scale_model,
				scale_serial	: req.body.scale_serial,
				scale_capacity	: req.body.scale_capacity,
				scale_divisions	: req.body.scale_divisions,
				units			: req.body.units,
				created_by		: 4
			*/
			
			if ( method === 'create' &&
		 	 (!Ticket.companyname || !Ticket.street ||
		 	  !Ticket.city || !Ticket.state || 
		 	  !Ticket.indicator_tag || !Ticket.indicator_model ||
		 	  !Ticket.indicator_manu || !Ticket.indicator_serial || 
		 	  !Ticket.scale_capacity || !Ticket.scale_divisions) 
		 	 ) {
				console.log(Ticket);
				return false;
			} else {
				return Ticket;
			}
		},
		
		remove : function (ticketId, next) {
			
			if ( ticketId ) {
				Connection.getConnection(function (err, connection) {
					if (!connection || err) {
						mySql.handleError(err);
					} 	
					
					connection.query('DELETE FROM ' + mySql.config.tickets_table + ' WHERE id = ?', ticketId, function (err, result) {
						
						connection.release();
						if (err) {
							next(err);
						} else if ( result.affectedRows ) {
							next(null, {
								success: true,
								message: 'The ticket was deleted successfully!'
							});
						} else {
							next(null, {
								success: false,
								message: 'An error occured while deleting the ticket, please try again.'
							});
						}
					});
				});
			} else {
				next({
					success: false,
					message: 'No ticket was passed as an argument for deletion',
					value  : ticketId,
					note   : 'If you received this in error, please notify the admin.'
				});
			}
		}
	}
	
	mySql.users = {
		all : function (next) {
			
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
			
				connection.query('SELECT id, username, firstName, lastName, email, role FROM users', function (err, rows) {
					connection.release();
					if (err) {
						next(err);
					} else if ( rows[0] !== undefined ) {
						next(null, rows);
					} else {
						next({
							success  : false,
							message  : 'No users were found.'
						});
					}
				});
				
				// sql procedure
				/**
				* CREATE DEFINER=`root`@`localhost` 
				* PROCEDURE `getUsers`() 
				* DETERMINISTIC 
				* READS SQL DATA 
				* SQL SECURITY DEFINER 
				* SELECT id, username, firstName, lastName, email 
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
				
				connection.query('SELECT id, username, firstName, lastName, email, role FROM users WHERE ?', options, function (err, rows) {
					connection.release();
					if (err) {
						cb(err);
					}
					else if ( rows[0] !== undefined ) {
						cb(null, rows[0]);
					} else {
						cb({
							success  : false,
							message  : 'No users were found that matched your query'
						});
					}
				});
			});
		},
		
		findLogin : function (options, next) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				connection.query('SELECT id, username, password, firstName, lastName, role, email FROM users WHERE ?', options, function (err, rows) {
					connection.release();
					if (err) {
						next(err);
					}
					else if ( rows[0] !== undefined ) {
						next(null, rows[0]);
					} else {
						next({
							success  : false,
							message  : 'No users were found that matched your query'
						});
					}
				});
			});
		},
		
		create : function (user, next) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} 	
				
				connection.query('INSERT INTO users SET ?', user, function (err, result) {   
				    
				    connection.release();
				    if (err) {
				    	next(err);
				    } else if ( result.insertId ) {
				    	next(null, {
				    		success: true,
				    		message: 'The user was successfully created!'
				    	});
				    } else {
				    	next(null, {
				    		success: false,
				    		message: 'That user already exists, please try a different username.'
				    	});
				    }
                });
			});
		},
		
		save : function (user, next) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				}
			
				connection.query('UPDATE users SET ? WHERE id = ?', [user, user.id], function (err, result) {
				    
				    connection.release();
				    console.log(err);
				    if (err) {
				    	if (err.errno == 1062) {
				    		next(null, {
				    			success: false,
				    			message: 'That username is already in use.  Your changes have not been saved.'
				    		});
				    	} else {
				    		next(err);
				    	}
				    } else if ( result.changedRows ) {
				    	next(null, {
				    		success: true,
				    		message: 'The user was successfully updated!'
				    	});
				    } else {
				    	next(null, {
				    		success: true,
				    		message: 'No changes were made to the user.'
				    	});
				    }
                });
			});	
		},
		
		remove : function (userId, next) {
			
			if ( userId ) {
				Connection.getConnection(function (err, connection) {
					if (!connection || err) {
						mySql.handleError(err);
					} 	
					
					connection.query('DELETE FROM users WHERE id = ?', userId, function (err, result) {
						
						connection.release();
						if (err) {
							next(err);
						} else if ( result.affectedRows ) {
							next(null, {
								success: true,
								message: 'The user was deleted successfully!'
							});
						} else {
							next(null, {
								success: false,
								message: 'An error occured while deleting the user, please try again.'
							});
						}
					});
				});
			} else {
				next({
					success: false,
					message: 'No user was passed as an argument for deletion',
					value  : userId,
					note   : 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		hashPassword : function (password, next) {
			bcrypt.genSalt(10, function (err, salt) {
				if (err) 
					next(err);
				
				if (salt) {
					bcrypt.hash(password, salt, null, function (err, result) {
						if (err)
							next(err);
						
						if (result) {
							next(null, {
								salt: salt,
								password: result
							});
						} else {
							next(null, {
								success: false,
								message: 'Something went wrong when generating the final hash.',
								result : result
							});
						}
					});
				} else {
					next(null, {
						success: false,
						message: 'Something went wrong when creating the salt.',
					});
				}			
			});
		},
		
		setUser : function (method, req, next) {
			var User = {};
			console.log(req.body);
			if ( req.params.user_id )
				User.id = req.params.user_id;
 			
			if ( req.body.firstName ) {
				User.firstName = req.body.firstName;
			}
			
			if ( req.body.lastName ) {
				User.lastName = req.body.lastName;
			}
			
			if ( req.body.username ) {
				User.username = req.body.username;
			}
			
			if ( req.body.password ) {
				var salt = bcrypt.genSaltSync(10);
				var pass = bcrypt.hashSync(req.body.password, salt);
				User.password = pass;
			}
				
				
			if ( req.body.email ) {
				User.email = req.body.email;
			}
			
			if ( req.body.role ) 
				User.role = req.body.role;
			
			if ( method === 'create' ) {
				User.created_by = req.decoded.id;
				
				if ( User.firstName && User.lastName && User.username && User.password && User.email ) {
					next(null, User);
				} else {
					next({
						success: false,
						message: 'You must fill out all of the fields.',
						require: 'Firstname, Lastname, Username, Password and Email'
					});
				}
			}
			
			else if ( method === 'save' ) {
				User.updated_by = req.decoded.id;
				next(null, User);
			} else {
				next({
					success: false,
					message: 'You must define the method: create / save'
				});
			}
		}
	}
	
	mySql.bcrypt = bcrypt;

	return mySql;
}
