var	jwt		= require('jsonwebtoken'),
	config  = require('../../config'),
	secret  = config.secret;
	
	
module.exports = function (app, express, mySql) {
	var apiAuth = express.Router();
	//authentication route
	apiAuth.route('/')
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

	return apiAuth;
}