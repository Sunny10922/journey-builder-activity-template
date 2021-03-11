define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', save);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        console.log('--Inside initialize');
        console.log(data);
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                $('#'+key).val(val); 
            });
        });
        
        connection.trigger('updateButton', {
            button: 'next',
            text: 'Get Voucher Code',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log(endpoints);
    }

    function save() {
        
        var firstName = $('#first_name').val();
        var lastName = $('#last_name').val();
        var voucherCode = firstName + '' + lastName + '12345';

        payload['arguments'].execute.outArguments = [{
            "voucher_code": voucherCode
        }];
        
        payload['metaData'].isConfigured = true;
        console.log(payload);
        connection.trigger('updateActivity', payload);
    }

});

var express = require('express')
var app = express()
const axios = require('axios');
const CircularJSON = require('circular-json');
var token = '';
var weatherData = [];

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
require('dotenv').load();
app.get('/', function (request, response) {
	response.send('Hello World!')
})

app.get('/connecttoMC', function (request, responsefromWeb) {
	console.log(process.env.CLIENT_ID);
	var conData = {
		'grant_type': 'client_credentials',
		'client_id': process.env.CLIENT_ID,
		'client_secret': process.env.CLIENT_SECRET
	}
	axios({
		method: 'post',
		url: 'https://mctg9llgcpl0dff718-t9898wqh1.auth.marketingcloudapis.com/v2/token',
		data: conData,
		headers: {
			'Content-Type': 'application/json',
		}
	})
		.then(function (response) {
			token = response.data.access_token;
			console.log(token);
			responsefromWeb.send('Authorization Sent');

		}).catch(function (error) {
			console.log(error);
			responsefromWeb.send(error);
		});
})