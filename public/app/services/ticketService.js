angular.module('ticketService', [])

.factory('Ticket', function($http) {

	// create a new object
	var ticketFactory = {};

	// get a single ticket
	ticketFactory.get = function(id) {
		return $http.get('/api/tickets/' + id);
	};

	// get all ticket
	ticketFactory.active = function() {
		return $http.get('/api/tickets');
	};
	
	ticketFactory.all = function() {
		return $http.get('/api/tickets/all');
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
	
	ticketFactory.event = {
		get : function(ticketId) {
			return $http.get('/api/tickets/' + ticketId + '/events');
		},
		
		getOne : function (eventId) {
			return $http.get('/api/events/' + eventId);
		},
		
		create : function(ticketId, eventData) {
			return $http.post('/api/tickets/' + ticketId + '/events', eventData);
		},
		
		update : function(eventId, eventData) {
			return $http.put('/api/events/' + eventId, eventData);
		},
		
		delete : function(ticketId, eventId) {
			return $http.delete('/api/events/' + eventId)
		}
	};
	
	ticketFactory.feedback = {
		get : function () {
			return $http.get('/api/feedback/');
		},
		
		getOne : function (feedbackId) {
			return $http.get('/api/feedback/' + feedbackId);
		},
		
		create : function (feedbackData) {
			return $http.post('/api/feedback/', feedbackData);
		},
		
		update : function (feedbackId, feedbackData) {
			return $http.put('/api/feedback/' + feedbackId, feedbackData);
		},
		
		delete : function (feedbackId) {
			return $http.delete('/api/feedback/' + feedbackId)
		}
	};

	// return our entire ticketFactory object
	return ticketFactory;

});