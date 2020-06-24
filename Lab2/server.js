require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
});

let mailOptions = {
	from: 'test.test@gmail.com',
	to: 'test.test2@gmail.com',
	subject: 'Test new',
	text: 'It works yes'
};

transporter.sendMail(mailOptions, function(err, data) {
	if (err) {
		console.log('Error Occurs');
	} else {
		console.log('Email sent !!!');
	}
})