
module.exports = function (app, express, mySql) {
	var apiFeedback = express.Router();
	
	apiFeedback.route('/')
		.post(function (req, res) {
			// create a new instance of the Feedback model
			var Feedback = mySql.feedback.setFeedback('create', req);

			if ( Feedback ) {
				mySql.feedback.create(Feedback, function (err, result) {
					console.log('result: ' + result);
					if (err) {
						console.log(err);
						res.status(500).send(err);
					} else {
						res.status(200).json(result);
					}
				});		
			} else {
				res.status(200).json({
					success : false,
					data	: {},
					message : 'Please fill in all of the required fields.'
				});
			}
		})
		
		.get(function (req, res) {
			mySql.feedback.all(function (err, result) {
				if (err) {
					console.log(err);
					res.status(500).send(err);
				} else {
					res.status(200).json(result);
				}
			});
		});
	
	apiFeedback.route('/:fb_id')	
		.get(function (req, res) {
			var fbId = req.params.fb_id;
			mySql.feedback.findOne({ id: fbId }, function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(200).json(result);
				}
			});
		})
		
		.put(function (req,res) {
			
			var Feedback = mySql.feedback.setFeedback('save', req);
			
			if ( Feedback ) {
				mySql.feedback.findOne({id: Feedback.id}, function (err, event) {
					if (err) {
						res.status(500).send(err);
					} else if (event) {
						mySql.feedback.save(Feedback, function (err, result) {
							if (err) {
								res.status(500).send(err);
							} else {								
								res.status(200).json(result);
							}
						});		
					} else {
						res.json({
							success: false,
							message : 'An error occured while updating the comment.'
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
		
	apiFeedback.use(function (req, res, next) {
		if (req.decoded) {
			if ( req.decoded.role === 'admin' || req.decoded.role === 'mod' ) {
				next()
			} else {
				return res.status(403).json({
					success: false,
					message: 'You do not have permission to perform this action.'
				});
			}
		} else {
			return res.status(401).json({
				success: false,
				message: 'You must be authenticated before using this site.'
			});
		}
	});
	
	apiFeedback.delete('/:fb_id', function (req, res) {
		mySql.feedback.remove(req.params.fb_id, function (err, result) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(result);
			}
		});
	});
	
	return apiFeedback;
}
