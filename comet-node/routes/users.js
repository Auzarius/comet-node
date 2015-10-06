var	jwt		= require('jsonwebtoken');

module.exports = function (app, express, mySql) {
	var apiUsers = express.Router();
	
	apiUsers.route('/')
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
		
	apiUsers.route('/username/:username')
		.get(function (req, res) {
			var username = req.params.username;
			mySql.users.findOne({ username: username }, function (err, user) {
				if (err)
					res.send(err);
				//return the user
				res.json(user);
			});
		})
	
	apiUsers.route('/:user_id')	
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
	
	return apiUsers;
}