var bootstrap = {

		namespaces : [],

		jsFiles :
			[
			 	"js.utils.Logger",
				"js.utils.Navigation",
				"js.model.data",
      ],

	    eaoEndpoints :
	    	[
            //{name : "main", URI : "https://" + devapp.smpInfo.server + "/com.warburtons.newcust/ncm.customer.web.warburtons.com/CustomerService.svc"}
	    	 ],

	    cssFiles :
	    	[
					"css/style.css"
	    	],
	    debugMode : "forcedTrue",
	    //development = "forcedTrue", uat = "true", production = "false"
	    logLevel : "error" //info, warn, debug, error
	    //development = info, uat = warn, production = error
};
