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

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        var express = require('express');
        var path = require('path');
        var bodyParser = require('body-parser');
        var app = express();

        app.set('port', process.env.PORT || 8080);

        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(express.static(path.join(__dirname, '../static')));

        app.get('/', function(req, res){
        res.redirect('/public');
        });

        app.post('/add', function(req, res){
            var a = req.body.numa;
            var b = req.body.numb;
            res.send(b);
        });

        var server = app.listen(app.get('port'), function(){
            var port = server.address().port;
        });

    }

    function initialize(data) {
        console.log('--Inside iitialize');
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

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
                console.log('--inArgument--');
                console.log(inArgument);
                
                $('#campaign_name').val(inArgument.campaignName);
            });
        });
        
        

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
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
        console.log('--Inside Save--');
        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
        payload.name = name;

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "emailAddress": "sunny.bansal@customactivity.com"
        }];

        payload['metaData'].isConfigured = true;

        console.log(payload);

        connection.trigger('updateActivity', payload);
    }

});