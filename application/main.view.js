sap.ui.jsview("application.main", {

	getControllerName : function() {
		return "application.main";
	},

	createContent : function(oController) {

		var app = new sap.m.SplitApp("responsiveApp");
		oController.splitApp = app;

		var oDetailView = responsiveApp.getNavigation().loadNewView("application.master.responsiveExamplesList");
		app.addMasterPage(oDetailView);

		return app;
	}
});
