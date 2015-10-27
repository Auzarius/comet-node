var	jwt		= require('jsonwebtoken');

module.exports = function (app, express, mySql) {
	var apiUsers = express.Router();
	
	apiUsers.get('/', function (req, res) {
		mySql.users.all(function (err, result) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(result);
			}
		});
	});
	
	apiUsers.use('/:user_id', function (req, res, next) {
		var userId = req.params.user_id;
		
		if ( userId == req.decoded.id || req.decoded.role === 'admin' || req.decoded.role === 'mod' ) {
			next();
		} else {
			res.status(403).json({ //403
				success: false,
				message: 'You do not have permission to perform this action.',
				status : 403
			});
		}
	});
	
	apiUsers.get('/:user_id', function (req, res) {
		var userId = req.params.user_id;
		
		mySql.users.findOne({ id: userId }, function (err, result) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(result);
			}
		});
	});
	
	apiUsers.get('/username/:username', function (req, res) {
		var username = req.params.username;
		mySql.users.findOne({ username: username }, function (err, result) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(result);
			}
		});
	});
	
	apiUsers.put('/:user_id', function (req, res) {
		var User = mySql.users.setUser('save', req);

		if ( User ) {
			mySql.users.findOne({id: User.id}, function (err, user) {
				if (err) {
					res.status(500).send(err);
				} else if (user) {
					mySql.users.save(User, function (err, result) {
						if (err) {
							res.status(500).send(err);
						} else {
							result.token = jwt.sign({
					                    		firstName	: user.data.firstName,
					                    		id 			: user.data.id,
					                    		role   		: user.data.role
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
						message : 'An error occured while updating the user.'
					});
				}
			})
		} else {
			res.json({
				success: false,
				message: 'Please fill in all of the required fields.'
			});
		}
	});
	
	apiUsers.use(function (req, res, next) {
		if (req.decoded) {
			if ( req.decoded.role === 'admin' || req.decoded.role === 'mod' ) {
				next()
			} else {
				return res.status(200).json({
					success: false,
					message: 'You do not have permission to perform this action.',
					status : 403
				});
			}
		} else {
			return res.status(401).json({
				success: false,
				message: 'You must be authenticated before using this site.'
			});
		}
	});
	
	apiUsers.post('/', function (req, res) {
		// create a new instance of the User model
		var User = mySql.users.setUser('create', req);
		
		if ( User ) {
			mySql.users.create(User, function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.json(result);
				}
			});		
		} else {
			res.status(422).json({
				success: false,
				message: 'Please fill in all of the required fields.'
			});
		}
	});			
	
	apiUsers.use(function (req, res, next) {
		if ( req.decoded.role === 'admin' ) {
			next();
		} else {
			return res.status(403).json({
				success: false,
				message: 'You do not have permission to perform this action.'
			});
		}
	});
	
	apiUsers.delete('/:user_id', function (req, res) {
		mySql.users.remove(req.params.user_id, function (err, result) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(result);
			}
		});
	});
	
	return apiUsers;
}
