module.exports = {
	'port'		: process.env.PORT || 1337,
	'c'			: {
		green	: '\x1b[32m',
		red		: '\x1b[31m',
		yellow	: '\x1b[33m',
		reset 	: '\x1b[00m'
	},
	
	db 			: {
		connectionLimit	: 50,
		host     		: 'localhost',
		user     		: 'root',
		password 		: '',
		database 		: 'comet_dev',
		users_table		: 'users',
		tickets_table	: 'tickets_import',
		events_table	: 'events',
		feedback_table 	: 'feedback'
	},
	
	secret		: '2ynIfxH9z3r0c00l'
	
};