angular.module('comet', 
               [
          		'app.routes',
                    'ngAnimate',
          		'authService',
          		'mainCtrl',
          		'userCtrl',
          		'userService',
                    'ticketCtrl',
                    'ticketService'
          	])
	// application configuration to integrate token into requests
	.config(["$httpProvider", function($httpProvider) {

		// attach our auth interceptor to the http requests
		$httpProvider.interceptors.push('AuthInterceptor');

	}]);

// inject ngRoute for all our routing needs
angular.module('app.routes', ['ngRoute'])
	// configure our routes
	.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl: './views/pages/home.html'
			})
			
			.when('/signin', {
				templateUrl : './views/pages/login.html',
				controller  : 'mainController',
				controllerAs: 'login'
			})
			
			.when('/feedback', {
				templateUrl : './views/pages/feedback/all.html',
				controller  : 'feedbackController',
				controllerAs: 'feedback'
			})
			
			.when('/feedback/:fb_id/edit', {
				templateUrl : './views/pages/feedback/edit.html',
				controller  : 'feedbackEditController',
				controllerAs: 'feedback'
			})
			
			// backup 403 display if the server throws the 403 status code
			.when('/forbidden', {
				templateUrl : './views/pages/403.html'
			})
			
			.when('/users', {
				templateUrl : './views/pages/users/all.html',
				controller  : 'userController',
				controllerAs: 'user'
			})

			.when('/users/create', {
				templateUrl : './views/pages/users/create.html',
				controller  : 'userCreateController',
				controllerAs: 'user'
			})

			.when('/users/:user_id', {
				templateUrl : './views/pages/users/edit.html',
				controller  : 'userEditController',
				controllerAs: 'user'
			})
			
			.when('/profile', {
				templateUrl : './views/pages/profile.html',
				controller  : 'userProfileController',
				controllerAs: 'user'
			})
			
			.when('/tickets', {
				templateUrl : './views/pages/tickets/all.html',
				controller  : 'ticketController',
				controllerAs: 'ticket'
			})
			
			.when('/tickets/all', {
				templateUrl : './views/pages/tickets/all.html',
				controller  : 'ticketAllController',
				controllerAs: 'ticket'
			})

			.when('/tickets/create', {
				templateUrl : './views/pages/tickets/create.html',
				controller  : 'ticketCreateController',
				controllerAs: 'ticket'
			})

			.when('/tickets/:ticket_id/edit', {
				templateUrl : './views/pages/tickets/edit.html',
				controller  : 'ticketEditController',
				controllerAs: 'ticket'
			})
			
			.when('/tickets/:ticket_id', {
				templateUrl : './views/pages/tickets/single.html',
				controller  : 'ticketViewController',
				controllerAs: 'ticket'
			})
			
			.when('/events/:event_id/edit', {
				templateUrl : './views/pages/events/edit.html',
				controller  : 'eventEditController',
				controllerAs: 'event'
			})
			
			.otherwise({
				redirectTo: '/'
			});
			
			// set our app up to have pretty URLS
			$locationProvider.html5Mode(true);
	}]);
	
angular.module('mainCtrl', ['angularMoment'])

.controller('mainController', ["$rootScope", "$location", "Auth", function($rootScope, $location, Auth) {

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
			
			if ( $location.path() == '/signin' ) {
				$location.path('/');
			}
			
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

}]);
angular.module('ticketCtrl', ['ticketService'])

.controller('ticketController', ["Ticket", function(Ticket) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the active tickets at page load
	Ticket.active()
		.success(function(node) {

			if ( node.success == false || node.data == null ) {
				vm.tickets = null;
			} else {
				vm.tickets = node.data;
			}
			
			vm.processing = false;
		})
		.error(function(node) {
			if (node) {
				vm.message = node;
			}
			
			vm.tickets = null;
			vm.processing = false;
		})

	// function to delete a ticket
	vm.deleteTicket = function(id) {
		vm.processing = true;
		
		Ticket.delete(id)
			.success(function(data) {
				
				if ( data.success) {
					Ticket.active()
						.success(function(node) {
							vm.tickets = node.data;
						});
				}
				
				vm.processing = false;
				vm.message = data.message;
			});
	};
}])


.controller('ticketAllController', ["Ticket", function(Ticket) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the active tickets at page load
	Ticket.all()
		.success(function(node) {

			if ( node.success == false || node.data == null) {
				vm.tickets = null;
			} else {
				vm.tickets = node.data;
			}
			
			vm.processing = false;
		});

	// function to delete a ticket
	vm.deleteTicket = function(id) {
		vm.processing = true;
		
		Ticket.delete(id)
			.success(function(data) {
				
				if ( data.success) {
					Ticket.all()
						.success(function(node) {
							vm.tickets = node.data;
						});
				}
				
				vm.processing = false;
				vm.message = data.message;
			});
	};
}])

// controller applied to ticket creation page
.controller('ticketCreateController', ["$scope", "Ticket", function($scope, Ticket) {
	
	var vm = this;

	// function to create a ticket
	vm.saveTicket = function() {
		vm.processing = true;
		vm.message = '';
		
		// use the create function in the ticketService
		Ticket.create(vm.ticketData)
			.success(function(node) {
				vm.processing = false;
				vm.message = node.message;
				vm.ticketData = {};
				$scope.ticketform.$setPristine();
				$("html, body").animate({ scrollTop: 0 }, 200); 
			});
			
	};
}])

// controller applied to ticket edit page
.controller('ticketEditController', ["$routeParams", "Ticket", function($routeParams, Ticket) {

	var vm = this;

	// get the ticket data for the ticket you want to edit
	// $routeParams is the way we grab data from the URL
	Ticket.get($routeParams.ticket_id)
		.success(function(node) {
			vm.ticketData = node.data;
		});

	// function to save the ticket
	vm.saveTicket = function() {
		vm.processing = true;
		vm.message = '';

		// call the ticketService function to update 
		Ticket.update($routeParams.ticket_id, vm.ticketData)
			.success(function(data) {
				vm.processing = false;
				vm.message = data.message;
				$("html, body").animate({ scrollTop: 0 }, 200); 
			});
	};

}])

.controller('ticketViewController', ["$scope", "$routeParams", "$location", "Ticket", function($scope, $routeParams, $location, Ticket) {

	var vm = this;
	vm.processing = true;
	vm.event_processing = true;
	$scope.eventForm = {};
	
	// get the ticket data for the ticket you want to view
	// $routeParams is the way we grab data from the URL
	vm.getTicket = function(id) {
		Ticket.get(id)
			.success(function(node) {
				vm.ticket = node.data;
				vm.processing = false;
			})
			.error(function(err) {
				vm.processing = false;
				vm.message = err;
			});
	}
	
	vm.getTicket($routeParams.ticket_id);
	
	vm.deleteTicket = function(id) {
		vm.processing = true;
		
		Ticket.delete(id)
			.success(function(data) {	
				vm.processing = false;
				
				if ( data.success) {
					$location.path('/tickets');
				}
			});
	}
	
	vm.getEvents = function() {
		Ticket.event.get($routeParams.ticket_id)
		.success(function(node) {
			vm.events = node.data;
			vm.event_processing = false;
		})
		.error(function(err) {
			vm.event_processing = false;
			vm.message = err;
		});
	}	
		
	vm.getEvents();
	
	vm.addEvent = function() {
		vm.event_processing = true;
		vm.message = '';

		Ticket.event.create($routeParams.ticket_id, vm.eventData)
			.success(function(data) {
				vm.event_processing = false;
				vm.ticket.timespent += vm.eventData.timespent;
				vm.eventData = {};
				$scope.eventform.$setPristine();
				vm.message = data.message;
				vm.getEvents();
			})
			.error(function(data) {
				vm.event_processing = false;
				vm.message = data.message;
			});
	}
	
	vm.deleteEvent = function(id) {
		vm.event_processing = true;
		
		Ticket.event.delete(id)
			.success(function(data) {
				if ( data.success ) {
					vm.getEvents();
				}
				
				vm.getTicket($routeParams.ticket_id);
				vm.event_processing = false;
				vm.message = data.message;
			})
			.error(function(data) {
				vm.event_processing = false;
				vm.message = data.message;
			});
	}
}])

.controller('eventEditController', ["$routeParams", "Ticket", function($routeParams, Ticket) {

	var vm = this;
	vm.eventData = {};

	Ticket.event.getOne($routeParams.event_id)
		.success(function(node) {
			vm.eventData = node.data;
		});

	// function to save the event
	vm.saveEvent = function() {
		vm.processing = true;
		vm.message = '';

		// call the ticketService function to update 
		Ticket.event.update(vm.eventData.id, vm.eventData)
			.success(function(data) {
				vm.processing = false;
				vm.message = data.message;
				$("html, body").animate({ scrollTop: 0 }, 200); 
			})
			.error(function(data) {
				vm.processing = false;
				vm.message = data.message;
			});
	};
}])

.controller('feedbackController', ["$scope", "$location", "Ticket", function($scope, $location, Ticket) {

	var vm = this;
	vm.comments = {};
	vm.processing = true;
	
	vm.getFeedback = function() {
		Ticket.feedback.get()
		.success(function(node) {
			vm.comments = node.data;
			vm.processing = false;
		})
		.error(function(err) {
			vm.processing = false;
			vm.message = err;
		});
	};
		
	vm.getFeedback();
	
	vm.addComment = function() {
		vm.processing = true;
		vm.message = '';
		
		Ticket.feedback.create(vm.feedbackData)
			.success(function(data) {
				vm.processing = false;
				vm.feedbackData = {};
				$scope.commentform.$setPristine();
				vm.getFeedback();
				vm.message = data.message;
			})
			.error(function(data) {
				vm.processing = false;
				vm.message = data.message;
			});
	};
	
	vm.deleteComment = function(id) {
		vm.processing = true;
		
		Ticket.feedback.delete(id)
			.success(function(data) {
				if ( data.success ) {
					vm.getFeedback();
				}
				
				vm.processing = false;
				vm.message = data.message;
			})
			.error(function(data) {
				vm.processing = false;
				vm.message = data.message;
			});
	};
}])

.controller('feedbackEditController', ["$routeParams", "Ticket", function($routeParams, Ticket) {

	var vm = this;
	vm.processing = true;
	vm.feedbackData = {};
	
	Ticket.feedback.getOne($routeParams.fb_id)
		.success(function(node) {
			vm.feedbackData = node.data;
			vm.processing = false;
		})
		.error(function(node) {
			vm.processing = false;
		});

	// function to save the event
	vm.saveComment = function() {
		vm.processing = true;
		vm.message = '';

		// call the ticketService function to update 
		Ticket.feedback.update(vm.feedbackData.id, vm.feedbackData)
			.success(function(data) {
				vm.processing = false;
				vm.message = data.message;
				$("html, body").animate({ scrollTop: 0 }, 200); 
			})
			.error(function(data) {
				vm.processing = false;
				vm.message = data.message;
			});
	};
}])

angular.module('userCtrl', ['userService'])

.controller('userController', ["User", function(User) {

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

}]);


// Courtesy of Scotch.io Chris Sevilleja & Holly Lloyd
// http://leanpub.com/mean-machine

angular.module('authService', [])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Auth', ["$http", "$q", "AuthToken", function($http, $q, AuthToken) {

	// create auth factory object
	var authFactory = {};

	// log a user in
	authFactory.login = function(username, password) {

		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
			.success(function(data) {
				AuthToken.setToken(data.token);
       			return data;
			});
	};

	// log a user out by clearing the token
	authFactory.logout = function() {
		// clear the token
		AuthToken.setToken();
	};

	// check if a user is logged in
	// checks if there is a local token
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken()) 
			return true;
		else
			return false;	
	};

	// get the logged in user
	authFactory.getUser = function() {
		if (AuthToken.getToken())
			return $http.get('/api/me', { cache: false });
		else
			return $q.reject({ message: 'User has no token.' });		
	};

	// return auth factory object
	return authFactory;

}])

// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================
.factory('AuthToken', ["$window", function($window) {

	var authTokenFactory = {};

	// get the token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	// function to set token or clear token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage
	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token);
	 	else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;

}])

// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', ["$q", "$location", "AuthToken", function($q, $location, AuthToken) {

	var interceptorFactory = {};

	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {

		// grab the token
		var token = AuthToken.getToken();

		// if the token exists, add it to the header as x-access-token
		if (token) 
			config.headers['x-access-token'] = token;
		
		return config;
	};

	// happens on response errors
	interceptorFactory.responseError = function(response) {

		// if our server returns a 403 forbidden response
		if (response.status == 401) {
			AuthToken.setToken();
			$location.path('/signin');
		} else if (response.status == 403) {
			$location.path('/forbidden');
		}

		// return the errors from the server as a promise
		return $q.reject(response);
	};

	return interceptorFactory;
	
}]);
angular.module('ticketService', [])

.factory('Ticket', ["$http", function($http) {

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
		
		delete : function(eventId) {
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

}]);
angular.module('userService', [])

.factory('User', ["$http", function($http) {

	// create a new object
	var userFactory = {};

	// get a single user
	userFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};
	
	// get self
	userFactory.self = function() {
		return $http.get('/api/me');
	};

	// get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	// create a user
	userFactory.create = function(userData) {
		return $http.post('/api/users/', userData);
	};

	// update a user
	userFactory.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	};

	// delete a user
	userFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

	// return our entire userFactory object
	return userFactory;

}]);