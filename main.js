'use strict'

const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

// Set your region for future requests.
AWS.config.region = 'ap-southeast-1';

// Serve website
app.use(express.static(__dirname + '/public'));

// Parse HTTP body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle uploading data
app.post('/upload', function(r, w) {
	if (!(r.body.name && r.body.data)) {
		w.sendStatus(400);
		return;
	}

	let s3bucket = new AWS.S3({
		params: {
			Bucket: 'bbh-ikea-dashboard',
			ACL: 'public-read',
		},
	});

	s3bucket.createBucket(function() {
		let params = { Key: r.body.name, Body: r.body.data };

		s3bucket.upload(params, function(err, data) {
			if (err)
				console.log("Error uploading data: ", err);
			else
				console.log("Successfully uploaded data to AWS S3");
		});
	});
	
	w.sendStatus(200);
});

app.listen(8080, function() {
	console.log('Test AWS S3 is listening on port 8080!');
});
