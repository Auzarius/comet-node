angular.module('mainCtrl', ['angularMoment'])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();
	
	
	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function(event) {
		vm.loggedIn = Auth.isLoggedIn();	
		
		if (vm.loggedIn) {
			Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});	
		} else {
			//$location.path('/login');
		}
		// get user information on page load
		
	});	

	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;			
				
				vm.user = vm.loginData.username;
				
				// if a user successfully logs in, redirect to users page
				if (data.success)			
					$location.path('/tickets');
				else 
					vm.error = data.message;
				
			});
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = null;
		
		$location.path('/login');
	};

});