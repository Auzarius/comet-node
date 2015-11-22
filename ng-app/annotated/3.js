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
	Ticket.get($routeParams.ticket_id)
		.success(function(node) {
			vm.ticket = node.data;
			vm.processing = false;
		})
		.error(function(err) {
			vm.processing = false;
			vm.message = err;
		});
	
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
