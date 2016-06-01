'use strict';

module.exports = function (app, express, mySql) {
	var apiCustomer = express.Router();
	
	apiCustomer.route('/')
		.get(function(req, res) {
			mySql.customers.list(function(err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					//console.log(result);
					res.status(200).json(result);
				}
			});
		});
	
	apiCustomer.route('/:id')
		.get(function(req, res) {
			let customerId = req.params.id;
			mySql.customers.findOne({ id: customerId }, function(err, result) {
				if (err) {
					res.status(500).send(err);
				} else {
					//console.log(result);
					res.status(200).json(result);
				}
			});
		});
		
	return apiCustomer;
}
