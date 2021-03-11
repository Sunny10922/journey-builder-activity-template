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

        var outArguments = payload['arguments'].execute.outArguments;

        $.each(outArguments, function (index, outArgument) {
            $.each(outArgument, function (key, val) {
                console.log('--AfBeforeter Update--');
                console.log(key);
                console.log(val);
            });
        });

        payload['arguments'].execute.outArguments = [{
            "voucher_code": voucherCode
        }];
        var outArgumentsUpdated = payload['arguments'].execute.outArguments;

        $.each(outArgumentsUpdated, function (index, outArgumentUpdated) {
            $.each(outArgumentUpdated, function (key, val) {
                console.log('--After Update--');
                console.log(key);
                console.log(val);
            });
        });
        payload['metaData'].isConfigured = true;

        console.log(payload);

        connection.trigger('updateActivity', payload);
    }

});