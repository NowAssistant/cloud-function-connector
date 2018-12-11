'use strict';

const api = require('./api');

module.exports = async function (activity) {
    try {
        api.initialize(activity);

        let functionName = activity.Request.Path;

        if (functionName.indexOf('/') !== -1) {
            functionName = functionName.substring(0, functionName.indexOf('/'));

            activity.Request.Path = activity.Request.Path.replace(functionName + '/', '');
        } else {
            activity.Request.Path = '';
        }

        const response = await api('/' + functionName, {
            body: activity,
            headers: {
                'x-api-key': activity.Context.connector.apikey
            }
        });

        activity = Object.assign(activity, response.body);
    } catch (error) {
        let m = error.message;

        if (error.stack) {
            m = m + ': ' + error.stack;
        }

        activity.Response.ErrorCode =
            (error.response && error.response.statusCode) || 500;

        activity.Response.Data = {
            ErrorText: m
        };
    }
};
