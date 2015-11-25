angular.module('mainCtrl', ['angularMoment'])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();
	
	
	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function(event) {
		vm.loggedIn = Auth.isLoggedIn();	
		
		if (vm.loggedIn) {
			vm.location = $location.path();
			Auth.getUser()
			.then(function(node) {
				vm.user = node.data
			});	
		} else if ( $location.path() == '/' || $location.path() == '/signin' ) {
			// do nothing;
		} else {
			$location.path('/signin');
		}
		// get user information on page load
		
	});
	
	// resets the view to the top of the page when a new route loads
	// this prevents the view focus from staying the same from page to page
	$rootScope.$on('$routeChangeSuccess',function() { 
		$("html, body").animate({ scrollTop: 0 }, 200); 
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
				
				// if a user successfully logs in, redirect to tickets page
				if (data.success)			
					$location.path('/');
				else 
					vm.error = data.message;
				
			});
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = null;
		
		$location.path('/signin');
	};

});