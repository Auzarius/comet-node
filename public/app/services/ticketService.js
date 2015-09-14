angular.module('ticketService', [])

.factory('Ticket', function($http) {

	// create a new object
	var ticketFactory = {};

	// get a single ticket
	ticketFactory.get = function(id) {
		return $http.get('/api/tickets/' + id);
	};

	// get all ticket
	ticketFactory.all = function() {
		return $http.get('/api/tickets');
	};

	// create a ticket
	ticketFactory.create = function(ticketData) {
		return $http.post('/api/tickets/', ticketData);
	};

	// update a ticket
	ticketFactory.update = function(id, ticketData) {
		return $http.put('/api/tickets/' + id, ticketData);
	};

	// delete a ticket
	ticketFactory.delete = function(id) {
		return $http.delete('/api/tickets/' + id);
	};

	// return our entire userFactory object
	return ticketFactory;

});