angular.module('ticketCtrl', ['ticketService'])

.controller('ticketController', function(Ticket) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the active tickets at page load
	Ticket.active()
		.success(function(node) {

			if ( node.success === false || node.data === null ) {
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
})


.controller('ticketAllController', function(Ticket) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the active tickets at page load
	Ticket.all()
		.success(function(node) {

			if ( node.success === false ) {
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
					Ticket.active()
						.success(function(node) {
							vm.tickets = node.data;
						});
				}
				
				vm.processing = false;
				vm.message = data.message;
			});
	};
})

// controller applied to ticket creation page
.controller('ticketCreateController', function($scope, Ticket) {
	
	var vm = this;
	$scope.ticketform = {};

	// function to create a ticket
	vm.saveTicket = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the ticketService
		Ticket.create(vm.ticketData)
			.success(function(node) {
				vm.processing = false;
				vm.ticketData = {};
				$scope.ticketform.$setPristine();

				vm.message = node.message;
			});
			
	};	

})

// controller applied to ticket edit page
.controller('ticketEditController', function($routeParams, Ticket) {

	var vm = this;

	// get the ticket data for the ticket you want to edit
	// $routeParams is the way we grab data from the URL
	console.log($routeParams.ticket_id);
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
			});
	};

})

.controller('ticketViewController', function($scope, $routeParams, Ticket) {

	var vm = this;
	$scope.eventform = {};
	vm.processing = true;
	vm.event_processing = true;
	
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
				vm.getEvents();
				vm.message = data.message;
				//$scope.eventform.$setPristine();
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
				vn.event_processing = false;
				vm.message = data.message;
			});
	}
});
