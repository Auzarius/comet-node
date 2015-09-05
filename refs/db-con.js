
module.exports = function (mysql) {
	
	var db = mysql.createConnection({
		host     		: 'localhost',
		user     		: 'root',
		password 		: '',
		database 		: 'brechbuhler_test'
	});

	db.connect(function (err) {
		if (err) {
			console.error('Error connecting to mysql' + err.stack);
			return;
		}
		
		console.log('Connected as ID: ' + db.threadId);
	});

	db.query('CALL getActiveTickets()', function (err, rows) {
		if (err) {
			console.error( '\x1b[31mFull error: \x1b[00m' + err.stack +
			               '\r\n\r\n\x1b[31mShort error: \x1b[00m' + err.message);
			return;
		}
		
		console.log(rows[0]);
	});
	
}
