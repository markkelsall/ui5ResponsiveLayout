sap.ui.controller("application.main", {

	onInit: function() {
		this.getView().setDisplayBlock(true);
		mainController = this;

		var jAttributes = new sap.ui.model.json.JSONModel({data: attributes});
		sap.ui.getCore().setModel(jAttributes, "attributes");
  }
});
