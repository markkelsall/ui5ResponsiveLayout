sap.ui.jsview("application.main", {

	getControllerName : function() {
		return "application.main";
	},

	createContent : function(oController) {

		var app = new sap.m.App("citApp");
		oController.app = app;

		var oDetailView = citApp.getNavigation().loadNewView("application.responsiveExample");
		app.addPage(oDetailView);

		return app;
	}
});
