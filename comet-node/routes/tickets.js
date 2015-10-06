
module.exports = function (app, express, mySql) {
	var apiTickets = express.Router();

	apiTickets.route('/')
		.post(function (req, res) {
			var Ticket = mySql.tickets.setTicket('create', req);
			
			if ( Ticket ) {
				mySql.tickets.create(Ticket, function (err, result) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.status(result.status).json(result);
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
			mySql.tickets.active(function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(result.status).json(result);
				}
			});
		});
		
	apiTickets.route('/all')
		.get(function (req, res) {
			mySql.tickets.all(function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(result.status).json(result);
				}
			});
		});
		
	apiTickets.route('/:id')
		.get(function (req, res) {
			mySql.tickets.findOne({ id: req.params.id }, function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(result.status).json(result);
				}
			});
		})
		
		.put(function (req, res) {
			var Ticket = mySql.tickets.setTicket('save', req);
			
			if ( Ticket ) {
				mySql.tickets.save(Ticket, function (err, result) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.status(result.status).json(result);
					}
				});
			} else {
				return res.status(422).json({
					success: false,
					message: 'An error occured, please make sure you have all required fields filled out.'
				});
			}
			
		})
		
		.delete(function (req, res) {
			mySql.tickets.remove(req.params.id, function (err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(result.status).json(result);
				}
			});
		});
		
	return apiTickets;
}