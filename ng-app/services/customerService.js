angular.module('customerService', [])

.factory('Customer', function($http) {

	// create a new object
	var customerService = {};

	// get a single customers data
	customerService.get = function(id) {
		return $http.get('/api/customers/' + id);
	};

	// get the customer list
	customerService.getList = function() {
		return $http.get('/api/customers');
	};

	// return our entire customerService object
	return customerService;

});
