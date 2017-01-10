var ServiceProvider = require("./Open311ServiceProvider.js");

//define a serviceprovider
ServiceProvider({
	gateway: "http://localhost:3000",

	//these properties are used to register in the gateway and will show up in /services
	service_name: "GenericService",
	description: "A generic open311 service provider",
	jurisdiction: 772,
	keywords: "bladiebla",

	// This is the actual event handler.
	// request contains the open311 request as a json object

	onrequest: function(request, reply){
		console.log(request);
		request.jurisdiction = "eindhoven";
		reply(request);
	}
});
