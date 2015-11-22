angular.module('userCtrl', ['userService'])

.controller('userController', ["User", function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function (node) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = node.data;
		});

	// function to delete a user
	vm.deleteUser = function(id) {
		vm.processing = true;
		vm.users = {};
		
		User.delete(id)
			.success(function(data) {
				
				// get all users to update the table
				// could also return the list of users with the delete call
				User.all()
					.success(function (node) {
						vm.processing = false;
						vm.users = node.data;
						
						vm.message = 'The user was successfully deleted!'
					});

			});
	};

}])

// controller applied to user creation page
.controller('userCreateController', ["$scope", "User", function($scope, User) {
	
	var vm = this;
	vm.type = 'create';
	vm.userData = {};

	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData)
			.success(function (data) {
				vm.processing = false;				
				vm.message = data.message;
				
				if (data.success) {
					vm.userData = {};
					$scope.userform.$setPristine();
					$("html, body").animate({ scrollTop: 0 }, 200); 
				}
			});
			
	};	

}])

// controller applied to user edit page
.controller('userEditController', ["$routeParams", "User", function($routeParams, User) {

	var vm = this;
	vm.type = 'edit';
	
	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function (node) {
			vm.userData = node.data;
		});

	// function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// call the userService function to update 
		User.update($routeParams.user_id, vm.userData)
			.success(function (data) {
				vm.processing = false;
				vm.message = data.message;
				$("html, body").animate({ scrollTop: 0 }, 200); 
			});
	};

}])

// controller applied to user edit page
.controller('userProfileController', ["$routeParams", "User", function($routeParams, User) {

	var vm = this;

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.self()
		.success(function (user) {
			User.get(user.id)
				.success(function (node) {
					vm.userData = node.data;
				});
		});

	// function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// call the userService function to update 
		User.update(vm.userData.id, vm.userData)
			.success(function (data) {
				vm.processing = false;
				vm.message = data.message;
				$("html, body").animate({ scrollTop: 0 }, 200); 
			});
	};

}]);

