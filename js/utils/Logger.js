var Logger = {

		setLogLevel : function (sLevel) {
			if (sLevel === null) {
				$.sap.log.setLevel($.sap.log.Level.ERROR);
				return;
			}

			sLevel = sLevel.toUpperCase();
			if (sLevel === "FATAL") {
				$.sap.log.setLevel($.sap.log.Level.FATAL);
			} else if (sLevel === "INFO") {
				$.sap.log.setLevel($.sap.log.Level.INFO);
			} else if (sLevel === "NONE") {
				$.sap.log.setLevel($.sap.log.Level.NONE);
			} else if (sLevel === "TRACE") {
				$.sap.log.setLevel($.sap.log.Level.TRACE);
			} else {
				$.sap.log.setLevel($.sap.log.Level.ERROR);
			}
		},

		error : function (sMsg) {
			$.sap.log.error(sMsg);
		},

		fatal : function (sMsg) {
			$.sap.log.fatal(sMsg);
		},

		info : function (sMsg) {
			$.sap.log.info(sMsg);
		},

		trace : function (sMsg) {
			$.sap.log.trace(sMsg);
		},

		showApplicationTrace : function () {
			try {
				var debugWindowContainer = new sap.ui.commons.Dialog();
				debugWindowContainer.setTitle("Application Trace");

				var comments = new sap.ui.commons.TextArea();
				comments.setCols(100);
				comments.setRows(20);
				comments.setEditable(false);

				var messages = $.sap.log.getLogEntries();
				if (messages !== undefined) {
					var aMessage = [];
					for (var i = 0; i < messages.length; i++) {
						var message = messages[i];

						var messageLine = message.date + " " + message.time + ": " + message.message;
						if (message.level === 5) {
							messageLine += " " + JSON.stringify(message.details);
						}
						aMessage.push(messageLine);
					}
					comments.setValue(aMessage.join("\n"));
					debugWindowContainer.addContent(comments);
				}

				debugWindowContainer.setModal(true);
				debugWindowContainer.setShowCloseButton(true);
				debugWindowContainer.open();
			} catch (e) {
				alert("Could not open the application trace: " + e);
			}
		}
};

//Register jQuery listener for the Application Trace dialog to be displayed
//CTRL, SHIFT, Z
$(document).keydown(function(e){
	if(e.ctrlKey && e.shiftKey && e.which === 90){
		Logger.showApplicationTrace();
	}
});

if (typeof console === undefined) {
	console = {};
	console.log = function () {};
	console.debug = function () {};
	console.error = function () {};
	console.warning = function () {};
}
