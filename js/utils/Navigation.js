function Navigation (sViewType) {
	this.splitApp = null;
	this.app = null;
	this.sViewType = sViewType;
}

/**
 * Function to load a new view or existing view.
 * Developers need to make sure that the view is already not a part of the DOM.
 * Also, if a particular view needs to be created more than once, then this function
 * should not be used. Use framework method instead.
 *
 * @class Navigation
 *
 * @param {String} sView - Full qualified page name e.g. view.viewName
 * @return oView - new view created having Id as qualified name of the View, with the passed in View Type
 * @version {@link Navigation}
 */
Navigation.prototype.loadNewView = function (sView) {
	var sId = this.replaceAllInString(sView, ".", "_");
	var oView = sap.ui.view({id: sId, viewName:sView, type:this.sViewType});
	return oView;
};

Navigation.prototype.navigate = function (sToDivId, sFromDivId, oController, oData, sTransition) {
	var oToView = $("#" + sToDivId);
	var oFromView = $("#" + sFromDivId);

	if (oController !== undefined && oController.onBeforeShow) {
		oController.onBeforeShow(oData);
	}

	sTransition = sTransition.toUpperCase();

	if (sTransition == "BACK") {
		oToView.slideDown();
		oFromView.slideUp();
	} else if (sTransition == "TO") {
		oToView.slideDown();
		oFromView.slideUp();
	}
};

/**
 * Function to navigate to a master view page
 *
 * @class Navigation
 *
 * @param {String} sView - Fully qualified view name e.g. application.master.main
 * @param {Object} oData -  data object or null (not mandatory)
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.toMasterPage = function (sView, oData, sTransitionName) {
	//check to see if sView already exists in the DOM by replacing . with _
	var sId = this.replaceAllInString(sView, ".", "_");
	var view = sap.ui.getCore().byId(sId);

	if (view === undefined) {
		//load view
		view = this.loadNewView(sView);
		//add view
		this.splitApp.addMasterPage(view);
	}

	sTransitionName = this.transitionLookup(sTransitionName);

	var evt = {};
    evt.data = oData;
	//In the case where the page is already visible, but we want to re-run the navigation
	if (this.splitApp.getCurrentMasterPage().getId() === sId && this.splitApp.getCurrentMasterPage().getController().onBeforeShow !== undefined) {
		this.splitApp.getCurrentMasterPage().getController().onBeforeShow(evt);
	} else {
		this.splitApp.toMaster(sId, sTransitionName, evt, null);
	}
};

/**
 * Function to navigate to a detail view page
 *
 * @class Navigation
 *
 * @param {String} sPage - Full qualified page name e.g. application.detail.mainPage
 * @param {Object} oData -  data object or null (not mandatory)
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.toDetailPage = function (sView, oData, sTransitionName) {
	//check to see if sView already exists in the DOM by replacing . with _
	var sId = this.replaceAllInString(sView, ".", "_");
	var view = sap.ui.getCore().byId(sId);

	if (view === undefined) {
		//load view
		view = this.loadNewView(sView);
		//add view
		this.getSplitApp().addDetailPage(view);
	}

	sTransitionName = this.transitionLookup(sTransitionName);

	var evt = {};
	evt.data = oData;
	if (this.getSplitApp().getCurrentDetailPage().getId() === sId && this.splitApp.getCurrentDetailPage().getController().onBeforeShow !== undefined) {
		this.splitApp.getCurrentDetailPage().getController().onBeforeShow(evt);
	} else {
		this.splitApp.toDetail(sId, sTransitionName, evt, null);
	}
};

Navigation.prototype.backMasterPage = function (oBackData, sView) {
	if (sView !== undefined) {
		var sId = this.replaceAllInString(sView, ".", "_");
		this.splitApp.backToPage(sId, oBackData);
	} else {
		this.splitApp.backMaster(oBackData);
	}
};

Navigation.prototype.backDetailPage = function (oBackData, sView) {
	if (sView !== undefined) {
		var sId = this.replaceAllInString(sView, ".", "_");
		this.splitApp.backToPage(sId, oBackData);
	} else {
		this.splitApp.backDetail(oBackData);
	}
};

Navigation.prototype.toPage = function (sPage, oData, sTransitionName) {
	//check to see if sPage already exists in DOM
	var sId = this.replaceAllInString(sPage, ".", "_");
	var page = sap.ui.getCore().byId(sId);

	if (page === undefined) {
		//load view
		var view = this.loadNewView(sPage);
		//add view
		this.app.addPage(view);
	}

	//work out transition
	sTransitionName = this.transitionLookup(sTransitionName);

	if (this.app.getCurrentPage().getId() == sId) {
		var evt = {};
		evt.data = oData;
		this.app.getCurrentPage().getController().onBeforeShow(evt);
	} else {
		this.app.to(sId, sTransitionName, oData, null);
	}
};


Navigation.prototype.backPage = function (oBackData, sView) {
	if (sView !== undefined) {
		var sId = this.replaceAllInString(sView, ".", "_");
		this.app.backToPage(sId, oBackData);
	} else {
		this.app.back(oBackData);
	}
};

Navigation.prototype.transitionLookup = function (sTransitionName) {
	if (sTransitionName != undefined) {
		sTransitionName = sTransitionName.toLowerCase();
		if (sTransitionName !== "fade" && sTransitionName !== "flip" && sTransitionName !== "show") {
			sTransitionName = "slide";
		}
	} else {
		sTransitionName = "slide";
	}

	return sTransitionName;
};

Navigation.prototype.replaceAllInString = function(sVariable, existingCharacter, newCharacter){
	var sReplacedString =  sVariable;
	for(var i=0;i<sVariable.split(".").length-1;i++){
		sReplacedString = sReplacedString.replace(existingCharacter, newCharacter);
	}
	return sReplacedString;
};

Navigation.prototype.getApp = function () {
	return this.app;
};

Navigation.prototype.setApp = function (app) {
	this.app = app;
};

Navigation.prototype.getSplitApp = function () {
	return this.splitApp;
};

Navigation.prototype.setSplitApp = function (splitApp) {
	this.splitApp = splitApp;
};
