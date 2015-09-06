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
				title  : 'Welcome to the authentication api',
				message: 'Please post the :username and :password to get a token'
			});
		})
		
		.post(function (req, res) {
		
			console.log(req.body.username);
			var User = {
				username : req.body.username,
				password : req.body.password
			};
			
			mySql.users.hashLogin(User, function (err, hash) {
				if (err) {
					res.send(err);
				} else {
					User.password = hash.pass;
				}
			});
			
			mySql.users.findOne({
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
						if (err) 
							res.send(err);
						
						if (!result) {
							res.json({
								success: false,
								message: 'Authentication failed. Incorrect password.',
								passa  : User.password,
								passb  : user.password
							});
						} else {
							var token = jwt.sign(
		                    	{ 
		                    		username: user.username,
		                    		id: user.id
		                    	},
		                    	secret, {
		                    		expiresInMinutes: 720
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
		});
	/* Leaving this commented for now to prevent requiring auth
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
					return res.json({
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
			return res.status(403).send({
				success: false,
				message: 'No token was provided.'
			});
		}
		
		//next() used to be here
	});
	*/
	apiRouter.route('/users')
		.post(function (req, res) {
			// create a new instance of the User model
			var User = {
				name 	 : req.body.name,
				username : req.body.username,
				password : req.body.password,
				email	 : req.body.email,
				created_by: req.body.username
			}
			
			// set the users information (comes from the request)
			mySql.users.hashPassword(User.password, function (err, hash) {
				if (err) {
					res.send(err);
				}
				
				if ( hash.pass && hash.salt ) {
					User.password = hash.pass;
					User.salt = hash.salt;
				
					mySql.users.create(User, function (err, response) {
						if (err) {
							res.send(err);
						} else {
							res.json({
								success: true,
								message: 'The user was created successfully!'
							});
						}						
					});
				} else {
					res.json({
						success: false,
						message: 'An error occured while creating the user.'
					});
				}
				
			});
			
		})
		
		.get(function (req, res) {
			mySql.users.all(function (err, users) {
				if (err) 
					res.send(err);
				//return the users
				res.json(users);
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
			// use our user model to find the user we want
			mySql.users.findOne({id: req.params.user_id}, function (err,user) {
				if (err)
					res.send(err);
				//update the users info only if its new
				
				if(req.body.name)
					user.name = req.body.name;
				
				if(req.body.username)
					user.username = req.body.username;
				
				if(req.body.password) {
					mySql.users.hashPassword(req.body.password, function (err, hash) {
						if (err) {
							res.send(err);
						} else {
							user.password = hash.pass;
							user.salt 	  = hash.salt;
						}
					});
				}
				
				// save the user
				mySql.users.save(user, function (err) {
					if (err) {
						res.send(err);
					} else {
						res.json({ 
							success: true,
							message: 'User updated!'
						});
					}
				});
			});
		})
		
		.delete(function (req, res) {
			User.remove({
				id: req.params.user_id
			}, function (err, user) {
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
			var Ticket = {
				status			: 'Pending',
				user_id			: req.decoded.id,
				companyname		: req.body.companyname,
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
				units			: req.body.units
			}
			
			mySql.tickets.create(Ticket, function (err, result) {
				if (err)
					res.send(err);
				
				res.json({
					success: true,
					message: 'The ticket was successfully created!'
				});
			});			
		})
		
		.get(function (req, res) {
			mySql.tickets.active(function (err, result) {
				if (err)
					res.send(err);
				
				res.json(result);
			});
		});
		
	apiRouter.route('/tickets/all')
		.get(function (req, res) {
			mySql.tickets.all(function (err, result) {
				if (err)
					res.send(err);
				
				res.json(result);
			});
		});
		
	apiRouter.route('/tickets/:id')
		.get(function (req, res) {
			mySql.tickets.findOne({ id: req.params.id }, function (err, ticket) {
				if (err)
					res.send(err);
				
				res.send(ticket);
			});
		})
		
		.put(function (req, res) {
			res.json({
				success: false,
				message: 'this is not yet implemented'
			});
		});
	
	return apiRouter;
}
