sap.ui.controller("application.master.responsiveExamplesList", {

	onInit: function() {
		responsiveExamplesListController = this;
  },

	onSimpleFormPress : function () {
		responsiveApp.getNavigation().toDetailPage("application.detail.responsiveFormExample");
	},

	onGridPress : function () {
		responsiveApp.getNavigation().toDetailPage("application.detail.responsiveGridExample");
	}
});
