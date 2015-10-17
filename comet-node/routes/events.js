
module.exports = function (app, express, mySql) {
	var apiEvents = express.Router();
	
	apiEvents.route('/')
		.post(function (req, res) {
			// create a new instance of the Event model
			var Event = mySql.events.setEvent('create', req);
			
			if ( Event ) {
				mySql.events.create(Event, function (err, result) {
					if (err) {
						console.log(err.code);
						res.status(500).send(err);
					} else {
						res.status(200).json(result);
					}
				});		
			} else {
				res.status(422).json({
					success: false,
					message: 'Please fill in all of the required fields.'
				});
			}
		})
		
		.get(function (req, res) {
			mySql.events.all(function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(200).json(result);
				}
			});
		});
	
	apiEvents.route('/:event_id')	
		.get(function (req, res) {
			var eventId = req.params.event_id;
			mySql.events.findOne({ id: eventId }, function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(200).json(result);
				}
			});
		})
		
		.put(function (req,res) {
			
			var Event = mySql.events.setEvent('save', req);
			
			if ( Event ) {
				mySql.events.findOne({id: Event.id}, function (err, event) {
					if (err) {
						res.status(500).send(err);
					} else if (event) {
						mySql.events.save(Event, function (err, result) {
							if (err) {
								res.status(500).send(err);
							} else {								
								res.status(200).json(result);
							}
						});		
					} else {
						res.json({
							success: false,
							message : 'An error occured while updating the event.'
						});
					}
				})
			} else {
				res.json({
					success: false,
					message: 'Please fill in all of the required fields.'
				});
			}
		})
		
		.delete(function (req, res) {
			mySql.events.remove(req.params.event_id, function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(200).json(result);
				}
			});
		});
	
	return apiEvents;
}
