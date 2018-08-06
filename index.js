const express = require('express'); // using the express framework for API
const app = express();

app.use(express.json()); //allowing use of JSON

//________________________________________________________________________________________________________________________________________

//email API:

//Array for the list of email that have been sent
const emailArray = [
	{id: 1, from: 'email1', subject: 'dinner', message: 'bla bla bla', to: 'email1to'},
	{id: 2, from: 'email2', subject: 'meeting', message: 'bla bla bla', to: 'email2to'},
	{id: 3, from: 'email3', subject: 'coupon', message: 'bla bla bla', to: 'email3to'},
];

//Welcome!
app.get('/',function(req,res){
	res.send('Welcome!');
});

//get methods for email: two methods, one for accessing all the emails in the array:
app.get('/api/email',function(req,res){
	res.send(emailArray);
});

//the other get method for accessing a specific email in the array:
app.get('/api/email/:id',function(req,res){
	//res.send(req.params.id);
	const singleEmail = emailArray.find(c =>c.id === parseInt(req.params.id));
	//if the id is not found -- 404 error
	if(!singleEmail){
		res.status(404).send('404 cannot find this test');
	}
	res.send(singleEmail);
});

//post method for email

app.post('/api/email',function(req,res){

	//input validation


	if(!req.body.from && !req.body.subject && !req.body.message && !req.body.to){
		res.status(400).send('Must include: "from (email address)","subject","message","to (email address)" ');
		return;
	}
	//checking for a 'from' email address
	if(!req.body.from){
		res.status(400).send('A "from" email address is required');
		return;
	};

	//checking for a correct formatt	
	if(validateEmail(req.body.from)==false){
		res.status(400).send('A proper "from" email address is required');
		return;
	};

	//checking for a 'to' email address
	if(!req.body.to){
		res.status(400).send('A "to" email address is required');
		return;
	};

	//checking for a correct formatt
	if(validateEmail(req.body.to)==false){
		res.status(400).send('A proper "to" email address is required');
		return;
	};
	//checks for the length of the subject
	if(req.body.subject.length>50){
		res.status(400).send('The length of the subject must be less than 50 characters');
		return;
	};
	//checsk for the length of the message
	if(req.body.message.length>12000){
		res.status(400).send('The length of the message must be less than 12,000 characters');
		return;
	};
	//when there is no given subject, a default blank subject is created
	if(!req.body.subject){
		req.body.subject = '*blank*';
	}
	//when there is no given message, a default message is given
	if(!req.body.message){
		req.body.message = '*blank*';
	}

	//this object is created when the post function is called
	//the object contains all of the neccesary parameters
	//at this point the input has already been validated to the data is simply copied in
	const newEmail = {
		id: emailArray.length+1,
		from : req.body.from,
		subject : req.body.subject,
		message : req.body.message,
		to: req.body.to
	};


	//adds the new email object into the exist array of email objects
	emailArray.push(newEmail);
	
	
	sendEmail(newEmail.id,newEmail.from,newEmail.subject,newEmail.message,newEmail.to);
	

	//the sent email is sent back to the console to show that the email has been sent
	res.send(newEmail);


});

app.delete('/api/email/:id',function(req,res){
	const singleEmail = emailArray.find(c =>c.id === parseInt(req.params.id));
	//if the id is not found -- 404 error
	if(!singleEmail) res.status(404).send('404 cannot find this test');

	const index = emailArray.indexOf(singleEmail);
	emailArray.splice(index,1);

	res.send(singleEmail); 
});


//this seperate method is used to validate email addresses
//this function uses regular expression for validation
function validateEmail(email){
	var regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regEx.test(email);
};

function sendEmail(id,from1,subject1,message1,to1){
	// using SendGrid's v3 Node.js Library
	// https://github.com/sendgrid/sendgrid-nodejs
	console.log('sendEmail is called');
	const sgMail = require('@sendgrid/mail');
	sgMail.setApiKey('Your API key for SendGrid goes here');
		const msg = {
			to: to1,
			from: from1,
			subject: subject1,
			text: message1
			//html:'<h1>tttttt</h1>'
		};
	sgMail.send(msg)
	.then(function(res){
		console.log("Success:\n");
		console.log(JSON.stringify(res));
		//JSON.parse();
	})
	.catch(function(err){
		console.log("Error occured\n");
		console.error(err);
	});
	
};


//________________________________________________________________________________________________________________________________________

//text message API:




//array of text messages to hold all of the posted messages
const textArray = [
	{id: 1, from: 'phone number',message: 'blablabla', to: 'phone number to'},
	{id: 2, from: 'phone number2',message:'blablabla', to: 'phone number to2'},
	{id: 3, from: 'phone number3',message:'blablabla', to: 'phone number to3'}
];

//two get methods: 
//this one sends the textArray
app.get('/api/text',function(req,res){
	res.send(textArray);
});

//this one sends a specific text based on id
app.get('/api/text/:id',function(req,res){
	const singleText = textArray.find(c =>c.id === parseInt(req.params.id));
	if(!singleText){
		res.status(404).send('404 cannot find this test');
	}
	res.send(singleText);
});


//the post method for a text
app.post('/api/text',function(req,res){

	//input validation

	//if no information is present, inform what is needed
	if(!req.body.from && !req.body.message && !req.body.to){
		res.status(400).send('Must include: "from (phone number)","message","to (phone number)" ');
		return;
	}
	//checking for a 'from' phone number
	if(!req.body.from){
		res.status(400).send('A "from" phone number is required');
		return;
	};

	//checking for a correct formatt	
	if(validatePhoneNumber(req.body.from)==false){
		res.status(400).send('A proper "from" phone number is required');
		return;
	};

	//checking for a 'to' phone number
	if(!req.body.to){
		res.status(400).send('A "to" phone number is required');
		return;
	};

	//checking for a correct formatt
	if(validatePhoneNumber(req.body.to)==false){
		res.status(400).send('A proper "to" phone number is required');
		return;
	};

	//checsk for the length of the message
	if(req.body.message.length>12000){
		res.status(400).send('The length of the message must be less than 12,000 characters');
		return;
	};
	//when there is no given message, a default message is given
	if(!req.body.message){
		req.body.message = '*blank*';
	}


	//this object is created when the post function is called
	//the object contains all of the neccesary parameters
	//at this point the input has already been validated to the data is simply copied in
	const newText = {
		id: textArray.length+1,
		from : req.body.from,
		message : req.body.message,
		to: req.body.to
	};


	//add the new text to the array of existing texts
	textArray.push(newText);

	sendText(newText.id,newText.from,newText.message,newText.to);
	
	//send back the sent text to confirm it sent
	res.send(newText);


});


app.delete('/api/text/:id',function(req,res){
	const singleText = textArray.find(c =>c.id === parseInt(req.params.id));
	//if the id is not found -- 404 error
	if(!singleText) res.status(404).send('404 cannot find this test');

	const index = textArray.indexOf(singleText);
	textArray.splice(index,1);

	res.send(singleText); 
});

//seperate method to validate phone number
//uses regular expression
function validatePhoneNumber(phoneNumber){
	var regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	return regEx.test(phoneNumber);
};

function sendText(id,from,message,to){
	console.log('sendText is called');
	const Nexmo = require('nexmo');
	const nexmo = new Nexmo({
	  	apiKey: 'Your API key for Nexmo goes here',
	  	apiSecret: 'Your "secret" for Nexmo goes here'
	});
	nexmo.message.sendSms(
	  'Your Nexmo Virtual number goes here', '1'+to, message,
	    (err, responseData) => {
	      if (err) {
	        console.log(err);
	      } else {
	        console.dir(responseData);
	      }
	    }
	 ); 

};

//________________________________________________________________________________________________________________________________________

//the port is set to 3000 unless it is taken
const port = (process.env.PORT || 3000); 
app.listen(port,console.log('Listening on port '+port+'...'));
