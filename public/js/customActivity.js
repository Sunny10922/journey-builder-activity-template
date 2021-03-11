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

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
                console.log('--inArgument--');
                console.log(inArgument);
                
                $('#first_name').val(inArgument.first_name); 
                $('#last_name').val(inArgument.last_name);
                $('#email_id').val(inArgument.email_id);
                $('#phone_number').val(inArgument.phone_number);
                $('#age').val(inArgument.age);
                $('#birth_date').val(inArgument.birth_date);
                $('#is_married').val(inArgument.is_married);  
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
        
        //payload.name = name;

        
        var firstName = $('#first_name').val();
        var lastName = $('#last_name').val();
        var voucherCode = firstName + '' + lastName + '12345';

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "voucher_code": voucherCode
        }];

        payload['metaData'].isConfigured = true;

        console.log(payload);

        connection.trigger('updateActivity', payload);
    }

});