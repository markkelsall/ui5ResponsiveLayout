function CITApp(sLocalResources, sViewType, sPlaceAt, sAppViewName, sErrorUri, bIsMobile) {
	//CS : Currently making changes as per RS PAC baseline and UI5 BP developments
	//TODO : include changes from WARBs
	this.version = "1.5";
	this.sLocalResources = sLocalResources;
	this.sViewType = sViewType;
	this.sPlaceAt = sPlaceAt;
	this.sAppViewName = sAppViewName;
	this.sErrorUri = sErrorUri;
	this.bIsMobile = bIsMobile;

	/**
	 * @param debugMode : String to distinguish whether the application is in debug mode or not.
	 * This is used for when switching between minifed and non-minifed files
	 */

	this.debugMode = "false";
	this.logLevel = "error";
	this.splitApp = null;
	this.app = null;
	this.eao = null;
	this.messageManager = null;
	this.navigation = null;
	this.EAOCollection = [];

	//initialise system properties
	this.bRetrieveSysProp = false;
	this.sSysPropUrl = "";
	this.oSysProp = null;

	var that = this;
	var functionName = this.init;

	setTimeout(function () {
		functionName(that);
	}, 0);

	return this;
}

/**
 * Initialisation of CITApplication
 */
CITApp.prototype.init = function (citApp) {
	try {
		citApp.loadBootstrap();
		citApp.retrieveSystemProperties(citApp, function () {
			try {
				citApp.navigation = new Navigation(citApp.sViewType);
				citApp.checkForLogLevel();
				citApp.loadMainView();
				$(document).ready(function(){
					//citApp.initialiseMessageManager();
				});
			} catch (e) {
				citApp.handleInitError(e, citApp);
			}
		});

	} catch (e) {
		citApp.handleInitError(e, citApp);
	}
};

/**
 * Function to load application main view
 * This method takes the value from CITApp initialise method
 * and set the main view with the splitApp created for the
 * application (cater for error scenario as well)
 * @class CITApp
 *
 * @param none
 * @return none
 * @version {@link CITApp}
 */
CITApp.prototype.loadMainView = function () {
	sap.ui.localResources(this.sLocalResources);

	try {
		var viewName = this.sLocalResources + "." + this.sAppViewName;
		var view = sap.ui.view({viewName:viewName, type:"JS"});
		if(this.sPlaceAt !==null && this.sPlaceAt !==""){
			view.placeAt(this.sPlaceAt);
		}
		this.getNavigation().setApp(view.getController().app);
		this.getNavigation().setSplitApp(view.getController().splitApp);
	} catch (e) {
		Logger.error(e.message);
		Logger.error(e.stack);
		throw e;
	}
};

/**
 * Function to initialise Message Manager class, a position variable could
 * be passed to set the position of message box on application layout
 *
 * @class CITApp
 *
 * @param {String} sPosition - Position on the Layout
 * @return {Boolean} bInitialisedMessageManager -  Boolean to verify if the Message Manager is initialised
 * @version {@link CITApp}
 */
CITApp.prototype.initialiseMessageManager = function(sPosition){
	var bInitialisedMessageManager = false;
	try{
		var messageManager = new MessageManager(sPosition,this.bIsMobile);
		this.messageManager = messageManager;
		bInitialisedMessageManager = true;
	}catch(e){
		Logger.error(e.stack);
		Logger.error(e.message);
	}

	return bInitialisedMessageManager;
};

CITApp.prototype.checkForLogLevel = function () {
	var logLevel = $.sap.getUriParameters().get("logLevel");
	if(logLevel !== null && logLevel !== "info" && logLevel !== "warn" && logLevel !== "debug") {
		this.logLevel = "error";
	} else {
		this.logLevel = logLevel;
	}
	Logger.setLogLevel(this.logLevel);
};

/**
 * Function to load all files for the project from bootstrap.js
 * (decides to load minified or non-minified version)
 * This method iterate over the nameSpaces & register the module
 * path, iterate over the CSS array & include style sheets and
 * iterate over the JS array & include JS files
 *
 * @class CITApp
 * @param none
 * @return none
 * @version {@link CITApp}
 */
CITApp.prototype.loadBootstrap = function () {
	try {
		$.sap.registerModulePath("js", "js");
		$.sap.require("js.bootstrap");

		if (bootstrap !== undefined) {
			//call the method to check whether the application is debug mode
			if (bootstrap.debugMode==="forcedTrue") {
				this.debugMode = true; // DEV Mode when always non-minified versions of file is needed.
			}else if(bootstrap.debugMode==="true"){
				this.checkForDebugMode();// UAT when URL may influence having minified version or not.
			}else if(bootstrap.debugMode==="false"){
				this.debugMode = false;// Production where always minified version is used.
			}

			//check the system properties
			if (bootstrap.retrieveSysProp !== undefined && (bootstrap.retrieveSysProp === true || bootstrap.retrieveSysProp === "true") && bootstrap.retrieveSysProp !== undefined && bootstrap.retrieveSysProp !== "") {
				this.bRetrieveSysProp = true;
				this.sSysPropUrl = bootstrap.sysPropUrl;
			}

			//iterate over the nameSpaces & register the module path
			if (bootstrap.namespaces !== undefined) {
				for (var i = 0; i < bootstrap.namespaces.length; i++) {
					var item = bootstrap.namespaces[i];
					$.sap.registerModulePath(item.nameSpace, item.filesLocation);
					if (item.registerCaching) {
						sap.ui.core.AppCacheBuster.register(item.filesLocation);
					}
				}
			}
			//iterate over the CSS array & include style sheets
			if (bootstrap.cssFiles !== undefined) {
				for (var i = 0; i < bootstrap.cssFiles.length; i++) {
					var item = bootstrap.cssFiles[i];
					$.sap.includeStyleSheet(item);
				}
			}

			//iterate over the JS array & include JS files
			if (bootstrap.jsFiles !== undefined) {
				for (var i = 0; i < bootstrap.jsFiles.length; i++) {
					var item = bootstrap.jsFiles[i];
					if (this.debugMode) {
						$.sap.require(item);
					} else {
						$.sap.require(item+"-min");
					}
				}
			}

			//Grab the endpoints from the bootstrap and add to a model
			if(bootstrap.eaoEndpoints !== undefined){
				sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(bootstrap.eaoEndpoints),"eaoBootstrap");
			}
		}
	} catch (e) {
		console.error("Could not load bootstrap configuration. Because ; "+e.stack);
	}
};

/**
 * Function to check if the "debug" parameter is in the URL & whether
 * it is set to true or false
 *
 * @class CITApp
 * @param none
 * @return {Boolean} debugMode -  Boolean to verify is debug mode ON?
 * @version {@link CITApp}
 */
CITApp.prototype.checkForDebugMode = function () {
	var debugMode = $.sap.getUriParameters().get("debug");
	if(debugMode === null) {
		//register module path - minified
		this.debugMode = false;
	} else {
		if (debugMode==="true") {
			this.debugMode = true; //register module path for non-minified files
		} else {
			this.debugMode = false; //register module path - minified
		}
	}
};

/**
 * Function to initialise EAO class, with passed in credentials and
 * service URL. This method return a boolean based on successful
 * initialisation
 *
 * @class CITApp
 *
 * @param {String} sServiceUrl - Service URL string
 * @param {String} bJson - Boolean value for choosing JSON (true/false)
 * @param {String} sUsername - For accessing Gateway services User Name
 * @param {String} sPassword - For accessing Gateway services User Password
 * @return {Boolean} bInitialisedEAO -  Boolean to verify if the EAO is initialised
 * @version {@link CITApp}
 */
CITApp.prototype.initialiseEAO = function (sServiceUrl, bJson, sUsername, sPassword){
	var bInitialisedEAO = false;
	try{
		var eao = new EAO(sServiceUrl, bJson, sUsername, sPassword);
		this.eao = eao;
		bInitialisedEAO = true;
	}catch(e){
		Logger.error(e.stack);
		Logger.error(e.message);
	}

	return bInitialisedEAO;
};


/**
 * Author Shambles
 *
 * function to get the EAO params from the boot strap and add the newly created model to a local structure.
 * eao can they be referenced using a friendly name i.e.
 *
 * @param name
 * @returns
 */
CITApp.prototype.getEAO = function (name) {
	var eaoCollection = this.EAOCollection;
	var oSysProp = this.oSysProp;

	//check if the EAO has already been loaded locally
	var eaoExists = false;
	var returnedEAO = null;
	$(eaoCollection).each(function(i){
		if(eaoCollection[i].name === name){
			eaoExists = true;
			returnedEAO = eaoCollection[i].eao;
		}
	});

	//EAO doesn't exist so we create this and bind to local model array
	if(!eaoExists){
		var eaoBootstrap = sap.ui.getCore().getModel('eaoBootstrap').getData();
		//Add the model to eaoCollection and set back to the core.
		for (var x = 0; x < eaoBootstrap.length; x++) {
			if(eaoBootstrap[x].name === name){
				var eaoModel = eaoBootstrap[x];

				//check to see if the sysProp value is set to true
				//if so, check the sysProp object for CIT App
				//the name attribute needs to match the system property name
				if (eaoModel.sysProp !== undefined && eaoModel.sysProp) {
					var sysPropValue = oSysProp[eaoModel.name];
					returnedEAO = new EAO(sysPropValue, eaoBootstrap[x].bJson, null, null, this.bIsMobile);
					eaoModel.eao = returnedEAO;
					eaoCollection.push(eaoModel);
				} else {
					returnedEAO = new EAO(eaoBootstrap[x].URI, eaoBootstrap[x].bJson, null, null, this.bIsMobile);
					eaoModel.eao = returnedEAO;
					eaoCollection.push(eaoModel);
				}
			}
		};
	}
	return returnedEAO;

};
CITApp.prototype.getMessageManager = function () {
	return this.messageManager;
};

CITApp.prototype.getNavigation = function () {
	return this.navigation;
};

/**
 * Function to handle the error thrown when initialising the application.
 */
CITApp.prototype.handleInitError = function (e, citApp) {
	try {
		if (console !== undefined && console.error !== undefined) {
			console.error(e.message);
			console.error(e.stack);
		} else {
			alert("Error message: " + e.message);
			alert("Error stack: " + e.stack);
		}

		if (localStorage !== undefined && localStorage.setItem !== undefined) {
			localStorage.setItem("errorMessage", e.message);
			localStorage.setItem("errorStack", e.stack);
			document.body.innerHTML = '<object type="text/html" data="' + citApp.sErrorUri + '" style="width:100%; height:100% !important;"></object>';
			document.body.className = "";
			document.body.style.height = "100%";
			document.getElementsByTagName("html")[0].className = "";
		} else {
			alert("A fatal error occurred when loading the application. Message: " + e1.message);
		}
	} catch (e1) {
		alert("[E3270959] There was a fatal error when loading the application.");
		alert("[E3870959] Original error: " + e.message);
		alert("[E3870959] Resulting error: " + e1.message);
	}
};

/**
 * Function to handle call to retrieve system properties
 */
CITApp.prototype.retrieveSystemProperties = function (citApp, fnCallback) {

	if (!this.bRetrieveSysProp) {
		fnCallback();
	}else{
		$.ajax({
			url: citApp.sSysPropUrl,
			method : "POST",
			dataType : "json"
		}).done(function(data, textStatus, jqXHR) {
			if (textStatus !== null && textStatus === "success") {
				if (data !== null) {
					citApp.oSysProp = data;
					fnCallback();
				}
			} else {
				//response wasn't success
				var e = {};
				e.message = "Failed response when retrieving system properties";
				e.stack = "";
				citApp.handleInitError(e, citApp);
			}
			//if the service doesn't return it as an object then try to create as an object?? Purely for ABAP
		}).fail(function(jqXHR, textStatus, errorThrown) {
			citApp.handleInitError(errorThrown, citApp);
		});
	}


};

CITApp.prototype.getSystemProperties = function () {
	return this.oSysProp;
};

CITApp.prototype.setSystemProperties = function (oSysProp) {
	this.oSysProp = oSysProp;
};
