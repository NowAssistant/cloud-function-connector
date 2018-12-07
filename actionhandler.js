
const testItems = require("./items.json");

module.exports = async function (activity) {

    try {

        var data = {};

        // extract _action from Request
        var _action = getObjPath(activity.Request, "Data.model._action");
        if (_action) {
            activity.Request.Data.model._action = {};
        } else {
            _action = {};
        }

        var action = activity.Request.Path;

        if (!action) {

            getData(activity, data);

        } else {

            debugger;
            data = getObjPath(activity.Request, "Data.model");
            data._action = { response: { success: true, message: "item " + action + " selected" } };

        }

        // copy response data
        activity.Response.Data = data;

        //        activity.Response.ErrorCode = 461;
        //        activity.Response.Data = { ErrorText: "something went wrong" };


    } catch (error) {

        // return error response
        var m = error.message;
        if (error.stack) m = m + ": " + error.stack;

        activity.Response.ErrorCode = (error.response && error.response.statusCode) || 500;
        activity.Response.Data = { ErrorText: m };

    }

    function getData(activity, data) {

        data.items = testItems.items;
		getActionList(data);
        // return _settings if they are changed
        //data._settings = activity.Context.ContentItemSettings;
    }

	function getActionList(data) {
		
		if (data.items)
		{
			if (!data._card)
			{
				data._card = {};
			}
			data._card.actionList = [];
			for (var i = 0; i < data.items.length; ++i) {
				var item = data.items[i];
				var index = i + 1;
				var action = { id: "a" + index, label: "Select " + index, source: "ControllerServiceHiddenNumberedAction", settings: { icon: "", actionType: "a", buttonType: 1, href: "", promptType: 0, promptForm: "", command: "" } };				
				data._card.actionList.push(action);				
			}
		}
		
	}
	
    function getObjPath(obj, path) {

        if (!path) return obj;
        if (!obj) return null;

        var paths = path.split('.'),
            current = obj;

        for (var i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }

};
