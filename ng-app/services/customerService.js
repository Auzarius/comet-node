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
	
	customerService.filterList = function(source, id) {
		for(var i = 0, len = source.length; i < len; i++) {
			if(source[i].id == id) {
				return source[i];
			}
		}

		return false;
	};

	// return our entire customerService object
	return customerService;

});
