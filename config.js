module.exports = {
	'port'		: process.env.PORT || 3000,
	'database'	: 'mongodb://localhost:27017/MEAN',
	'c'			: {
		green	: '\x1b[32m',
		red	: '\x1b[31m',
		yellow: '\x1b[33m',
		reset : '\x1b[00m'
	},
	db 			: {
		connectionLimit	: 50,
		host     		: 'localhost',
		user     		: 'root',
		password 		: '',
		database 		: 'brechbuhler_test'
	}
};