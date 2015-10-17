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

				// clear the form
				// vm.ticketData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

})

.controller('ticketViewController', function($routeParams, Ticket) {

	var vm = this;
	vm.processing = true;
	
	// get the ticket data for the ticket you want to view
	// $routeParams is the way we grab data from the URL
	Ticket.get($routeParams.ticket_id)
		.success(function(node) {
			vm.ticket = node.data;
			vm.processing = false;
		});
		
	// function to delete a ticket
	vm.deleteTicket = function(id) {
		vm.processing = true;

		Ticket.delete(id)
			.success(function(data) {

				// get all active tickets to update the table
				// you can also set up your api 
				// to return the list of tickets with the delete call
				Ticket.active()
					.success(function(data) {
						vm.processing = false;
						vm.ticket = {};
						
						vm.message = 'The ticket was successfully deleted!'
					});

			});
	};
});