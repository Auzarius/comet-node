angular.module('userCtrl', ['userService'])

.controller('userController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function (node) {

			if ( node.success == false || node.data == null ) {
				vm.users = null;
			} else {
				vm.users = node.data;
			}
			
			vm.processing = false;
		})
		.error(function (node) {
			if (node) {
				vm.message = node;
			}
			
			vm.users = null;
			vm.processing = false;
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

})

// controller applied to user creation page
.controller('userCreateController', function($scope, User) {
	
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

})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

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

})

// controller applied to user edit page
.controller('userProfileController', function($routeParams, User) {

	var vm = this;

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.self()
		.success(function (user) {
			vm.userData = user;
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

});

