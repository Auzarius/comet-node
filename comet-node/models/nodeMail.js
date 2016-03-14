var nodemailer = require('nodemailer');

module.exports = function(config) {
	
	var mailer = this;
	
	mailer.config = config;
	
	mailer.send = function(message, subject, emails) {
		var transporter = nodemail.createTransport({
			service: 'Gmail',
			auth: {
				user: config.email.user,
				pass: config.email.pass
			}
		});
		
		var options = {
			from: 'inshop@gmail.com>',
			to: emails,
			subject: subject,
			text: message
		};
		
		transport.sendMail(options, function(err, res) {
			if (err) {
				throw new Error(err);
			} else {
				console.log("Email result: ", res);
			}
		});
	}
	
	return mailer;
}
