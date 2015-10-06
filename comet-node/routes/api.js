
//var User	= require('../models/user'),
var	jwt		= require('jsonwebtoken'),
	config  = require('../../config');
	secret  = config.secret;

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
						res.status(500).send(err);
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
			                    
			                    res.status(200).json({
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
					return res.status(401).send({
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
		
	apiRouter.get('/me', function (req, res) {
		res.send(req.decoded);
	});
	
	return apiRouter;
}
