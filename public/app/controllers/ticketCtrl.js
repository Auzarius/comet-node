angular.module('ticketCtrl', ['ticketService'])

.controller('ticketController', function(Ticket) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the active tickets at page load
	Ticket.all()
		.success(function(data) {

			// when all the tickets come back, remove the processing variable
			vm.processing = false;

			// bind the tickets that come back to vm.tickets
			vm.tickets = data;
		});

	// function to delete a ticket
	vm.deleteTicket = function(id) {
		vm.processing = true;
		
		Ticket.delete(id)
			.success(function(data) {

				// get all active tickets to update the table
				// you can also set up your api 
				// to return the list of tickets with the delete call
				Ticket.all()
					.success(function(data) {
						vm.processing = false;
						vm.tickets = data;
						
						vm.message = 'The ticket was successfully deleted!'
					});

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
			.success(function(data) {
				vm.processing = false;
				vm.ticketData = {};
				$scope.ticketform.$setPristine();

				vm.message = data.message;
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
		.success(function(data) {
			vm.ticketData = data;
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

	// get the ticket data for the ticket you want to view
	// $routeParams is the way we grab data from the URL
	Ticket.get($routeParams.ticket_id)
		.success(function(data) {
			vm.ticketData = data;
		});
		
	// function to delete a ticket
	vm.deleteTicket = function(id) {
		vm.processing = true;

		Ticket.delete(id)
			.success(function(data) {

				// get all active tickets to update the table
				// you can also set up your api 
				// to return the list of tickets with the delete call
				Ticket.all()
					.success(function(data) {
						vm.processing = false;
						vm.tickets = data;
						
						vm.message = 'The ticket was successfully deleted!'
					});

			});
	};
});