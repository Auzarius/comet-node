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
		
		process.on('uncaughtError', function (err) {
			console.log('\x1b[31mUncaught Error occured:\x1b[00m ' + err.message );
			
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
		return ( result !== null && result !== undefined);
		// && /[A-Za-z0-9]+/.test(result) 
	}
	
	mySql.query = function(query, vars, next) {	
		if ( query ) {
			Connection.getConnection(function (err, connection) {
				if (!connection || err) {
					mySql.handleError(err);
				} else {
					if ( vars === null ) {
						connection.query(query, function (err, result) {
							connection.release();
							next(err, result);
						});
					} else {
						connection.query(query, vars, function (err, result) {
							connection.release();
							next(err, result);
						});
					}
				}
			});
		} else {
			throw new Error('A query must be passed as the first parameter for this function\n' +
			                '@params query (string), vars [optional] (array), callback (function)');
		}
	}
	
	mySql.tickets = {
		active : function (next) {
			//console.log('\x1b[33mticket.active query\x1b[0m');
			var query = 'SELECT t.id, t.customer, t.indicator_tag, t.indicator_manu, t.indicator_model, t.created_at, ' +
				'( SELECT status FROM ' + mySql.config.events_table + ' WHERE ticket_id = t.id AND status != \'Additional Notes\' ORDER BY created_at DESC LIMIT 1) AS status, ' +
				'( SELECT CONCAT(firstName,\' \', lastName) FROM ' + mySql.config.users_table + ' WHERE id = t.created_by ) AS created_by, ' +
				'( SELECT created_at FROM ' + mySql.config.events_table + ' ' + 
				'	WHERE ticket_id = t.id ' +
				'	ORDER BY created_at DESC ' +
				'	LIMIT 1 ' +
				') AS updated_at, ' +
				'( SELECT CONCAT(u.firstName,\' \', u.lastName) FROM ' + mySql.config.events_table + ' e ' +
				'	INNER JOIN ' + mySql.config.users_table + ' u ON u.id = e.created_by ' +
				' 	WHERE e.ticket_id = t.id ' +
				' 	ORDER BY e.created_at DESC ' +
				' 	LIMIT 1 ' +
				') AS updated_by ' +
				'FROM ' + mySql.config.tickets_table + ' t ' +
				'HAVING status != \'Complete\' AND status != \'Non-repairable\' AND ' +
				'		status != \'Replaced\' AND status != \'Delivered\' ' +
				'ORDER BY t.customer ASC, status ASC, t.indicator_tag ASC';
			
			/* old query, changed to get the most recent event as the updated value
			'SELECT t.id, t.customer, t.indicator_tag, t.indicator_manu, t.indicator_model, t.created_at, t.updated_at, ' +
            '( SELECT status FROM ' + mySql.config.events_table + ' WHERE ticket_id = t.id ORDER BY created_at DESC LIMIT 1) AS status, ' +
            '( SELECT CONCAT(firstName, \' \', lastName) FROM ' + mySql.config.users_table + ' WHERE id = t.created_by ) AS created_by, ' +
            '( SELECT CONCAT(firstName, \' \', lastName) FROM ' + mySql.config.users_table + ' WHERE id = t.updated_by ) AS updated_by ' +
            'FROM ' + mySql.config.tickets_table + ' t ' +
            'HAVING status = \'Pending\' OR status = \'Diagnosed\' OR status = \'Repaired\' ' +
            'ORDER BY t.customer ASC, status ASC, t.indicator_tag ASC';
            */
			
			mySql.query(query, null, function (err, result) {
				if (err) {
					throw new Error(err);
					next(err);
				} else if ( mySql.verifyResult(result)) {
					next(null, {
						success : true,
						data 	: result,
						status	: 200
					});
				} else {
					next(null, {
						success : false,
						message : 'No tickets were found that matched your query',
						status 	: 404
					});
				}
			});
		},
		
		all : function (next) {
			//console.log('\x1b[33mticket.all query\x1b[0m');
			var query = 'SELECT t.id, t.customer, t.indicator_tag, t.indicator_manu, t.indicator_model, t.created_at, ' +
				'( SELECT status FROM ' + mySql.config.events_table + ' WHERE ticket_id = t.id AND status != \'Additional Notes\' ORDER BY created_at DESC LIMIT 1) AS status, ' +
				'( SELECT CONCAT(firstName,\' \', lastName) FROM ' + mySql.config.users_table + ' WHERE id = t.created_by ) AS created_by, ' +
				'( SELECT created_at FROM ' + mySql.config.events_table + ' ' + 
				'	WHERE ticket_id = t.id ' +
				'	ORDER BY created_at DESC ' +
				'	LIMIT 1 ' +
				') AS updated_at, ' +
				'( SELECT CONCAT(u.firstName,\' \', u.lastName) FROM ' + mySql.config.events_table + ' e ' +
				'	INNER JOIN ' + mySql.config.users_table + ' u ON u.id = e.created_by ' +
				' 	WHERE e.ticket_id = t.id ' +
				' 	ORDER BY e.created_at DESC ' +
				' 	LIMIT 1 ' +
				') AS updated_by ' +
				'FROM ' + mySql.config.tickets_table + ' t ' +
				'ORDER BY t.customer ASC, status ASC, t.indicator_tag ASC';
			mySql.query(query, null, function (err, result) {
				if (err) {
					throw new Error(err);
					next(err);
				} else if (mySql.verifyResult(result)) {
					next(null, {
						success : true,
						data 	: result,
						status	: 200
					});
				} else {
					next(null, {
						success : false,
						message : 'No tickets were found that matched your query',
						status	: 404
					});
				}
			});
		},
		
		filter : function (field, search, next) {
			//console.log('\x1b[33mticket.all query\x1b[0m');
			var query = 'SELECT t.id, t.status, t.customer, t.indicator_tag, t.indicator_manu, t.indicator_model, t.created_at, t.updated_at, ' +
		                '( SELECT firstName FROM ' + mySql.config.users_table + ' WHERE id = t.created_by ) AS created_by, ' +
		                '( SELECT firstName FROM ' + mySql.config.users_table + ' WHERE id = t.updated_by ) AS updated_by ' +
		                'FROM ' + mySql.config.tickets_table + ' t ' +
		                'WHERE t.' + field + ' like \'%' + search + '%\' ' +
		                'ORDER BY t.customer ASC, t.status ASC, t.indicator_tag ASC';
			
			mySql.query(query, null, function (err, result) {
				if (err) {
					throw new Error(err);
					next(err);
				} else if (mySql.verifyResult(result)) {
					next(null, {
						success : true,
						data 	: result,
						status	: 200
					});
				} else {
					next(null, {
						success : false,
						message : 'No tickets were found that matched your query',
						status	: 404
					});
				}
			});
		},
		
		findOne : function (options, next) {
			//console.log('\x1b[33mticket.findOne query\x1b[0m');
			var query = 'SELECT *, ( ' +
			    'SELECT sum(timespent) ' +
			    'FROM ' + mySql.config.events_table + ' e ' +
			    'WHERE e.ticket_id = t.id ) as timespent ' +
				'FROM ' + mySql.config.tickets_table + ' t WHERE ?';
			
			mySql.query(query, options, function (err, result) {			
				if (err) {
					throw new Error(err);
					next(err);
				} else if ( mySql.verifyResult(result[0]) ) {
					next(null, {
						success : true,
						data 	: result[0],
						status	: 200
					});
				}
				else {
					next(null, {
						success : false,
						message : 'The ticket you are looking for does not exist',
						status	: 404
					});
				}
			});
		},
		
		create : function (ticket, next) {
			//console.log('\x1b[33mticket.create query\x1b[0m');
			var query = 'INSERT INTO ' + mySql.config.tickets_table + ' SET ?';
			
			mySql.query(query, ticket, function (err, result) {
				if (err) {
					throw new Error(err);
					next(err);
				} else if ( result.affectedRows > 0 ) {
					next(null, {
						success : true,
						message	: 'The ticket was created successfully!',
						rows 	: result.affectedRows,
						status	: 200,
						insertId: result.insertId
					});
				} else {
					next(null, {
						success : false,
						message : 'An error occured while creating the ticket.',
						status	: 500
					});
				}
			});
		},
		
		save : function (ticket, next) {
			//console.log('\x1b[33mticket.save query\x1b[0m');
			var query  = 'SELECT id FROM ' + mySql.config.tickets_table + ' WHERE ?';
			
			mySql.query(query, { id: ticket.id }, function (err, result) {
				if ( result[0] ) {
					query = 'UPDATE ' + mySql.config.tickets_table + ' SET ? WHERE id = ?';
					mySql.query(query, [ticket, ticket.id], function (err, result) {
						if (err) {
							throw new Error(err);
							next(err);
						} else if ( result.changedRows > 0 ) {
							next(null, {
								success : true,
								message : 'The ticket was successfully updated!',
								status	: 200
							});
						} else {
							next(null, {
								success : false,
								message : 'No changes were made to the ticket.',
								status  : 304
							});
						}
					})
				} else {
					next(null, {
						success : false,
						message : 'The ticket you are trying to update does not exist.',
						status	: 404
					});
				}
			});
		
			
		},
		
		remove : function (ticketId, next) {
			
			if ( ticketId ) {
				//console.log('\x1b[33mticket.remove query\x1b[0m');
				var query = 'DELETE FROM ' + mySql.config.tickets_table + ' WHERE id = ?';
				
				mySql.query(query, ticketId, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( result.affectedRows > 0 ) {
						mySql.events.purge(ticketId, function (err, result) {
							if (err)
								throw new Error(err);
							
							next(null, {
								success : true,
								message : 'The ticket was deleted successfully!',
								status	: 200
							});
						});
						
						
					} else {
						next(null, {
							success : false,
							message : 'An error occured while deleting the ticket, please try again if you feel this was in error.',
							status	: 304
						});
					}
				});
			} else {
				throw new Error('No value was passed for @param ticketId (int)');
				next({
					success: false,
					message: 'No ticket was passed as an argument for deletion',
					value  : ticketId,
					note   : 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		setTicket : function (method, req) {
			var Ticket = {};

			if ( req.params.id )
				Ticket.id = req.params.id;
			
			Ticket.workorder = req.body.workorder;
			
			if ( req.body.customer )
				Ticket.customer = req.body.customer;
			
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
			
			Ticket.scale_manu = req.body.scale_manu ? req.body.scale_manu : '';
			
			Ticket.scale_model = req.body.scale_model ? req.body.scale_model : '';
			
			Ticket.scale_serial = req.body.scale_serial ? req.body.scale_serial : '';
			
			if ( req.body.scale_capacity ) 
				Ticket.scale_capacity = req.body.scale_capacity;
			
			if ( req.body.scale_divisions ) 
				Ticket.scale_divisions = req.body.scale_divisions;
			
			if ( req.body.units && /^(lb|kg|g|oz|mg)$/m.test(req.body.units) ) {
				Ticket.units = req.body.units;
			} else {
				Ticket.units = 'lb';
			}
			
			if ( method == 'create' )
				Ticket.created_by = req.decoded.id;
			
			if ( method == 'save' )
				Ticket.updated_by = req.decoded.id;
			
			// Removed these as required fields, leaving here as a note
			// !Ticket.street || !Ticket.city || !Ticket.state
			if ( method === 'create' || method === 'save' ) {
				if (!Ticket.customer || !Ticket.indicator_tag || 
				    !Ticket.indicator_model ||
		 	  		!Ticket.indicator_manu || !Ticket.indicator_serial || 
		 	  		!Ticket.scale_capacity || !Ticket.scale_divisions ) {
					
					return false;
				} else {
					return Ticket;
				}
			} else {
				throw new Error('The methods \'create\' or \'save\' must be passed when using this function');
				return false;
			}
		}
	}
	
	mySql.users = {
		all : function (next) {
			//console.log('\x1b[33musers.all query\x1b[0m');
			var query = 'SELECT id, username, firstName, lastName, email, role FROM ' + mySql.config.users_table;
			
			mySql.query(query, null, function (err, result) {
				if (err) {
					throw new Error(err);
					next(err);
				} else if ( mySql.verifyResult(result)) {
					next(null, {
						success : true,
						data 	: result,
						message : ''
					});
				} else {
					next(null, {
						success : false,
						message : 'There are no users available at this time.'
					});
				}
			});
		},
		
		findOne : function (options, next) {
			//console.log('\x1b[33musers.findOne query\x1b[0m');
			var query = 'SELECT id, username, firstName, lastName, email, role FROM ' + mySql.config.users_table + ' WHERE ?';
			
			if ( options ) {
				mySql.query(query, options, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( mySql.verifyResult(result[0])) {
						next(null, {
							success : true,
							data 	: result[0],
							status 	: 200
						});
					} else {
						next(null, {
							success : false,
							status 	: 304,
							message : 'The user you were looking for could not be found.'
						});
					}
				});
			} else {
				throw new Error('No options were passed for the search query.');
				next({
					success : false,
					message : 'No options were passed for the search query.',
					value	: options,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		findLogin : function (options, next) {
			//console.log('\x1b[33musers.findLogin query\x1b[0m');
			var query = 'SELECT id, username, password, firstName, lastName, role, email FROM ' + mySql.config.users_table + ' WHERE ?';
			
			if ( options ) {
				mySql.query(query, options, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( mySql.verifyResult(result[0])) {
						next(null, {
							success : true,
							data 	: result[0],
						});
					} else {
						next(null, {
							success : false,
							message : 'No users were found that matched your query.'
						});
					}
				});
			} else {
				throw new Error('No options were passed for the search query.');
				next({
					success : false,
					message : 'No options were passed for the search query.',
					value	: options,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
			
		},
		
		create : function (user, next) {
			//console.log('\x1b[33musers.create query\x1b[0m');
			var query = 'INSERT INTO ' + mySql.config.users_table + ' SET ?';
			
			if ( user ) {
				mySql.query(query, user, function (err, result) {
					if (err) {
						if (err.errno === 1062) {
							next(null, {
								success : false,
								message : 'That username is already in use.  Please try a different username.'
							});
						} else {
							throw new Error(err);
							next(err);
						}
					} else if ( result.affectedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The user was created successfully!'
						});
					} else {
						next(null, {
							success : false,
							message	: 'An error occured while creating the user.'
						});
					}
				});
			} else {
				throw new Error('No user was passed as an argument for creation.');
				next({
					success : false,
					message : 'No user was passed as an argument for creation.',
					value	: user,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		save : function (user, next) {
			//console.log('\x1b[33musers.save query\x1b[0m');
			var query = 'UPDATE ' + mySql.config.users_table + ' SET ? WHERE id = ?';
			
			if ( user ) {
				mySql.query(query, [user, user.id], function (err, result) {
					if (err) {
						if (err.errno === 1062) {
							next(null, {
								success : false,
								message : 'That username is already in use.  Your changes have not been saved.'
							});
						} else {
							throw new Error(err);
							next(err);
						}
					} else if ( result.changedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The user was updated successfully!'
						});
					} else {
						next(null, {
							success : false,
							message : 'No changes were made, nothing to save.'
						});
					}
				});
			} else {
				throw new Error('No user was passed as an argument for updating.');
				next({
					success : false,
					message : 'No user was passed as an argument for updating.',
					value	: user,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		remove : function (userId, next) {
			//console.log('\x1b[33musers.save query\x1b[0m');
			
			if ( userId ) {
				var query = 'DELETE FROM ' + mySql.config.users_table + ' WHERE id = ?';
				mySql.query(query, userId, function (err, result) {
					if (err) {
						throw new Error(err);
					} else if ( result.affectedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The user was deleted successfully!'
						});
					} else {
						next(null, {
							success : false,
							message : 'An error occured while deleting the user.'
						});
					}
				});
			} else {
				throw new Error('No user was passed as an argument for deletion!')
				next({
					success: false,
					message: 'No user was passed as an argument for deletion.',
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
		
		setUser : function (method, req) {
			var User = {};

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
			}
			
			if ( method === 'save' ) {
				User.updated_by = req.decoded.id;
			}
			
			if ( method === 'create' || method === 'save' ) {
				if ( method === 'create' && ( User.firstName && User.lastName && 
				    User.username && User.password && User.email) ) {
					return User;
				} else if ( method === 'save' && ( User.firstName && User.lastName && 
				           User.username && User.email )) {
					return User;
				} else {
					throw new Error('You must fill out all of the fields.\n' +
					                    'Required fields: Firstname, Lastname, Username, Password and Email');
					return false;
				}
			} else {
				throw new Error('You must define the method: create / save');
				return false;
			}
		}
	}
	
	mySql.events = {
		all : function (ticketId, next) { 
			//console.log('\x1b[33mevents.all query\x1b[0m');
			var query = 'SELECT e.id, e.status, e.comments, e.created_at, e.updated_at, e.timespent, ' + 
						'( SELECT username FROM ' + mySql.config.users_table + ' WHERE id = e.created_by ) AS username, ' +
						'( SELECT CONCAT(firstName, \' \', lastName) FROM ' + mySql.config.users_table + ' WHERE id = e.created_by ) AS created_by, ' +
		                '( SELECT CONCAT(firstName, \' \', lastName) FROM ' + mySql.config.users_table + ' WHERE id = e.updated_by ) AS updated_by ' +
						'FROM ' + mySql.config.events_table + ' e ' +
						'WHERE ? ' +
						'ORDER BY created_at DESC';
			mySql.query(query, ticketId, function (err, result) {
				if (err) {
					throw new Error(err);
					next(err);
				} else if ( mySql.verifyResult(result)) {
					next(null, {
						success : true,
						data 	: result,
						message : ''
					});
				} else {
					next(null, {
						success : false,
						message : 'There are no events available at this time.'
					});
				}
			});
		},
		
		findOne : function (options, next) {
			//console.log('\x1b[33mevents.findOne query\x1b[0m');
			var query = 'SELECT *, (SELECT CONCAT(firstName, \' \', lastName) FROM ' + mySql.config.users_table + ' WHERE id = e.created_by) AS author ' +
						'FROM ' + mySql.config.events_table + ' e ' +
						'WHERE ?';
			
			if ( options ) {
				mySql.query(query, options, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( mySql.verifyResult(result[0])) {
						next(null, {
							success : true,
							data 	: result[0],
							status 	: 200
						});
					} else {
						next(null, {
							success : false,
							status 	: 304,
							message : 'The event you were looking for could not be found.'
						});
					}
				});
			} else {
				throw new Error('No options were passed for the search query.');
				next({
					success : false,
					message : 'No options were passed for the search query.',
					value	: options,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		create : function (event, next) {
			//console.log('\x1b[33mevents.create query\x1b[0m');
			var query = 'INSERT INTO ' + mySql.config.events_table + ' SET ?';

			if ( event ) {
				mySql.query(query, event, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( result.affectedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The event was created successfully!'
						});
					} else {
						next(null, {
							success : false,
							message	: 'An error occured while creating the event.'
						});
					}
				});
			} else {
				throw new Error('No event was passed as an argument for creation.');
				next({
					success : false,
					message : 'No event was passed as an argument for creation.',
					value	: event,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		save : function (event, next) {
			//console.log('\x1b[33mevents.save query\x1b[0m');
			var query = 'UPDATE ' + mySql.config.events_table + ' SET ? WHERE id = ?';
			
			if ( event ) {
				mySql.query(query, [event, event.id], function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( result.changedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The event was updated successfully!'
						});
					} else {
						next(null, {
							success : false,
							message : 'No changes were made, nothing to save.'
						});
					}
				});
			} else {
				throw new Error('No event was passed as an argument for updating.');
				next({
					success : false,
					message : 'No event was passed as an argument for updating.',
					value	: event,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		remove : function (eventId, next) {
			//console.log('\x1b[33mevents.remove query\x1b[0m');
			
			if ( eventId ) {
				var query = 'DELETE FROM ' + mySql.config.events_table + ' WHERE id = ?';
				mySql.query(query, eventId, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( result.affectedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The event was deleted successfully!'
						});
					} else {
						next(null, {
							success : false,
							message : 'An error occured while deleting the event.'
						});
					}
				});
			} else {
				throw new Error('No event was passed as an argument for deletion!')
				next({
					success: false,
					message: 'No event was passed as an argument for deletion.',
					value  : eventId,
					note   : 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		purge : function (ticketId, next) {
			//console.log('\x1b[33mevents.purge query\x1b[0m');
			
			if ( ticketId ) {
				var query = 'DELETE FROM ' + mySql.config.events_table + ' WHERE ticket_id = ?';
				mySql.query(query, ticketId, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( result.affectedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The events were deleted successfully!',
							count	: result.affectedRows
						});
					} else {
						next(null, {
							success : false,
							message : 'An error occured while deleting the events.'
						});
					}
				});
			} else {
				throw new Error('No ticket id was passed as an argument for deletion!')
				next({
					success: false,
					message: 'No ticket id was passed as an argument for deletion.',
					value  : eventId,
					note   : 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		setEvent : function (method, req) {
			
			var Event = {};
			
			Event.status = req.body.status ? req.body.status : 'Pending';
			
			if ( req.params.event_id )
				Event.id = req.params.event_id;
			
			if ( req.params.id || req.ticket_id )
				Event.ticket_id = req.ticket_id ? req.ticket_id : req.params.id;
			
			if ( Event.status == 'Diagnosed' || Event.status == 'Repaired' || Event.status == 'Additional Notes' ) {
				Event.timespent = req.body.timespent ? req.body.timespent : 0;
			} else {
				Event.timespent = 0;
			}
			
			
			if ( req.body.comments)
				Event.comments = req.body.comments;
			
			if ( method === 'create' ) {
				Event.created_by = req.decoded.id;
			}

			if ( method === 'save' )
				Event.updated_by = req.decoded.id;
			
			if ( method === 'create') {
				if (Event.status && Event.comments && Event.ticket_id && Event.created_by ) {
					return Event;
				} else {
					return false;
				}
			} else if ( method === 'save' ) {
				if (Event.status && Event.comments && Event.updated_by ) {
					return Event;
				} else {
					return false;
				}
			} else {
				throw new Error('The methods \'create\' or \'save\' must be passed when using this function');
				return false;
			}
		}
	}
	
	mySql.feedback = {
		all : function (next) {
			//console.log('\x1b[33mfeedback.all query\x1b[0m');
			var query = 'SELECT f.id, f.status, f.comments, f.created_at, f.updated_at, ' +
						'(SELECT username FROM ' + mySql.config.users_table + ' WHERE id = f.created_by ) AS username, ' +
						'(SELECT CONCAT(firstName, \' \', lastName) FROM users WHERE id = f.created_by) AS created_by, ' +
						'(SELECT CONCAT(firstName, \' \', lastName) FROM users WHERE id = f.updated_by) AS updated_by ' +
						'FROM ' + mySql.config.feedback_table + ' f ' +
						'ORDER BY created_at DESC';
			
			mySql.query(query, null, function (err, result) {
				if (err) {
					throw new Error(err);
					next(err);
				} else if ( mySql.verifyResult(result)) {
					next(null, {
						success : true,
						data 	: result,
						message : ''
					});
				} else {
					next(null, {
						success : false,
						message : 'There is no feedback available at this time.'
					});
				}
			});
		},
		
		findOne : function (options, next) {
			//console.log('\x1b[33mfeedback.findOne query\x1b[0m');
			var query = 'SELECT * FROM ' + mySql.config.feedback_table + ' WHERE ?';
			
			if ( options ) {
				mySql.query(query, options, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( mySql.verifyResult(result[0])) {
						next(null, {
							success : true,
							data 	: result[0],
							status 	: 200
						});
					} else {
						next(null, {
							success : false,
							status 	: 304,
							message : 'The comment you were looking for could not be found.'
						});
					}
				});
			} else {
				throw new Error('No options were passed for the search query.');
				next({
					success : false,
					message : 'No options were passed for the search query.',
					value	: options,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		create : function (feedback, next) {
			//console.log('\x1b[33mfeedback.create query\x1b[0m');
			var query = 'INSERT INTO ' + mySql.config.feedback_table + ' SET ?';

			if ( feedback ) {
				mySql.query(query, feedback, function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( result.affectedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The comment was created successfully!'
						});
					} else {
						next(null, {
							success : false,
							message	: 'An error occured while creating the comment.'
						});
					}
				});
			} else {
				throw new Error('No feedback was passed as an argument for creation.');
				next({
					success : false,
					message : 'No feedback was passed as an argument for creation.',
					value	: feedback,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		save : function (feedback, next) {
			//console.log('\x1b[33mfeedback.save query\x1b[0m');
			var query = 'UPDATE ' + mySql.config.feedback_table + ' SET ? WHERE id = ?';
			
			if ( feedback ) {
				mySql.query(query, [feedback, feedback.id], function (err, result) {
					if (err) {
						throw new Error(err);
						next(err);
					} else if ( result.changedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The comment was updated successfully!'
						});
					} else {
						next(null, {
							success : false,
							message : 'No changes were made, nothing to save.'
						});
					}
				});
			} else {
				throw new Error('No feedback was passed as an argument for updating.');
				next({
					success : false,
					message : 'No feedback was passed as an argument for updating.',
					value	: feedback,
					note	: 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		remove : function (feedbackId, next) {
			//console.log('\x1b[33mfeedback.save query\x1b[0m');
			
			if ( feedbackId ) {
				var query = 'DELETE FROM ' + mySql.config.feedback_table + ' WHERE id = ?';
				mySql.query(query, feedbackId, function (err, result) {
					if (err) {
						throw new Error(err);
					} else if ( result.affectedRows > 0 ) {
						next(null, {
							success : true,
							message : 'The comment was deleted successfully!'
						});
					} else {
						next(null, {
							success : false,
							message : 'An error occured while deleting the comment.'
						});
					}
				});
			} else {
				throw new Error('No feedback was passed as an argument for deletion!')
				next({
					success: false,
					message: 'No feedback was passed as an argument for deletion.',
					value  : feedbackId,
					note   : 'If you received this in error, please notify the admin.'
				});
			}
		},
		
		setFeedback : function (method, req) {
			
			var Feedback = {};
			var id = req.params.id ? req.params.id : null;
			
			if ( id )
				Feedback.id = id;
			
			if ( req.body.status )
				Feedback.status = req.body.status;
			
			if ( req.body.comments )
				Feedback.comments = req.body.comments;
			
			if ( method === 'create' )
				Feedback.created_by = req.decoded.id;
			
			if ( method === 'save' )
				Feedback.updated_by = req.decoded.id;
			
			if ( method === 'create' || method === 'save' ) {
				if (Feedback.status && Feedback.comments) {
					return Feedback;
				} else {
					return false;
				}
			} else {
				throw new Error('The methods \'create\' or \'save\' must be passed when using this function');
				return false;
			}
		}
	}
	
	mySql.bcrypt = bcrypt;

	return mySql;
}
