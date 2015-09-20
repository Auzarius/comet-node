
//var User	= require('../models/user'),
var	jwt		= require('jsonwebtoken'),
	config  = require('../../config');

	
var secret  = config.secret;

module.exports = function (app, express, mySql) {
	var apiRouter = express.Router();
	
	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function (req,res) {
		res.json({ 
			title   : 'Hooray!  Welcome to the Comet.node API!',
			message : 'Please see /api/authenticate to get an access token'
		});
	});
	
	//authentication route
	apiRouter.route('/authenticate')
		.get(function (req, res) {
			res.json({
				title  : 'Welcome to the authentication section of the api',
				message: 'Please post the :username and :password to get a token'
			});
		})
		
		.post(function (req, res) {
			
			if ( req.body.username && req.body.password ) {
				var User = {
					username : req.body.username,
					password : req.body.password
				};
				
				mySql.users.findLogin({
					username: User.username
				}, function (err, user) {
					if (err) {
						//mySql.handleError(err);
						res.send(err);
					}
					else if (!user) {
						res.json({
							success: false,
							message: 'Authentication failed. That username was not found.'
						});
					}
					else if (user) {
						var validPassword = mySql.bcrypt.compare(User.password, user.password, function (err, result) {
							if (err) {
								res.send(err);
							}
							else if (!result) {
								res.json({
									success: false,
									message: 'Authentication failed. Incorrect password.',
								});
							} else {
								var token = jwt.sign(
			                    	{
			                    		firstName	: user.firstName,
			                    		lastName	: user.lastName,
			                    		username	: user.username,
			                    		id 			: user.id,
			                    		email		: user.email,
			                    		role   		: user.role
			                    	},
			                    	secret, {
			                    		expiresInMinutes: 1700
			                    	}
			                    );
			                    
			                    res.json({
			                    	success: true,
			                    	message: 'Enjoy your token!',
			                    	token  : token
			                    });
							}
						});
					} else {
						res.send({
							success: false,
							message: 'Something happened while trying to authenticate.'
						});
					}
				});
			} else {
				res.status(401).send({
					success: false,
					message: 'A username and password are required for authentication.'
				});
			}
		});
	
	apiRouter.use(function (req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');
		
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		
		// decode token
		if (token) {
			// verifies secret and checks expiration
			jwt.verify(token, secret, function (err, decoded) {
				if (err) {
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
				}
			});
		} else {
			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an error message
			return res.status(401).send({
				success: false,
				message: 'No token was provided.'
			});
		}
		
		//next() used to be here
	});
	
	apiRouter.route('/users')
		.post(function (req, res) {
			// create a new instance of the User model
			var User = mySql.users.setUser('create', req, function (err, User) {
				if (err) {
					res.send(err);
				}
				else if (User.password && User.password !== req.body.password ) {

					if (User.email && User.firstName && User.lastName && User.username) {
						mySql.users.create(User, function (err, response) {
							if (err) {
								res.send(err);
							} else {
								console.log('success');
								res.json({
									success: true,
									message: 'The user was created successfully!'
								});
							}						
						});
					} else {
						res.json({
							success: false,
							message: 'Please fill in all of the required fields.'
						});
					}	
				} else {
					res.json({
						success: false,
						message: 'The password field cannot be left blank.'
					});
				}
			});
		})
		
		.get(function (req, res) {
			mySql.users.all(function (err, users) {
				if (err) {
					res.send(err);
				} else {
					res.json(users);
				}
			});
		});
		
	apiRouter.route('/users/username/:username')
		.get(function (req, res) {
			
		})
	
	apiRouter.route('/users/:user_id')	
		.get(function (req, res) {
			var userId = req.params.user_id;
			mySql.users.findOne({ id: userId }, function (err, user) {
				if (err)
					res.send(err);
				//return the user
				res.json(user);
			});
		})
		
		.put(function (req,res) {
			
			mySql.users.setUser('save', req, function (err, User) {
				
				if (err) {
					res.send(err);
				} else if (User && req.params.user_id) {
					mySql.users.findOne({id: User.id}, function (err, user) {
						if (err) {
							res.send(err);
						} else if ( user ) {
							// save the user
							mySql.users.save(User, function (err, result) {
								if (err) {
									res.json(err);
								} else {
									result.token = jwt.sign(
				                    	{
				                    		firstName	: user.firstName,
				                    		id 			: user.id,
				                    		role   		: user.role
				                    	},
				                    	secret, {
				                    		expiresInMinutes: 1700
				                    	}
				                    );
				                    
									res.json(result);
								}
							});
						} else {
							res.json({
								success: false,
								message: 'An error occured while updating the user.'
							});
						}
						
					});
				} else {
					res.json({
						success: false,
						message: 'An error occured while checking the user database.'
					});
				}
			});
		})
		
		.delete(function (req, res) {
			mySql.users.remove(req.params.user_id, function (err, user) {
				if (err)
					return res.send(err);
				
				res.json({
					success: true,
					message: 'User successfully deleted!'
				});
			});
		});
		
	apiRouter.get('/me', function (req, res) {
		res.send(req.decoded);
	});
	
	apiRouter.route('/tickets')
		.post(function (req, res) {
			var Ticket = mySql.tickets.setTicket('create', req);
			
			if ( Ticket ) {
				mySql.tickets.create(Ticket, function (err, result) {
					if (err)
						res.send(err);
					
					res.json({
						success: true,
						message: 'The ticket was successfully created!'
					});
				});		
			} else {
				res.json({
					success: false,
					message: 'Please fill in all of the required fields.'
				});
			}
				
		})
		
		.get(function (req, res) {
			mySql.tickets.active(function (err, result) {
				if (err) {
					res.send(err);
				} else {
					res.json(result);
				}
			});
		});
		
	apiRouter.route('/tickets/all')
		.get(function (req, res) {
			mySql.tickets.all(function (err, result) {
				if (err) {
					res.send(err);
				} else {
					res.json(result);
				}
			});
		});
		
	apiRouter.route('/tickets/:id')
		.get(function (req, res) {
			mySql.tickets.findOne({ id: req.params.id }, function (err, ticket) {
				if (err) {
					res.send(err);
				} else {
					console.log(ticket);
					res.send(ticket);
				}
			});
		})
		
		.put(function (req, res) {
			var Ticket = mySql.tickets.setTicket('save', req);
			
			mySql.tickets.save(Ticket, function (err, result) {
				if (err) {
					res.send(err);
				} else if (result) {
					res.json(result);
				} else {
					res.json({
						success: false,
						message: 'An error occured while updating the ticket, please try again.'
					});
				}
			});
		})
		
		.delete(function (req, res) {
			mySql.tickets.remove(req.params.id, function (err, user) {
				if (err) {
					return res.json({
						success: false,
						message: err.message
					});
				} else {
					res.json({
						success: true,
						message: 'Ticket successfully deleted!'
					});
				}
			});
		});
	
	return apiRouter;
}
