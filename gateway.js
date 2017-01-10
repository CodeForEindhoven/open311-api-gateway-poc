//this gateway supplies the outside world with the open311 API,
//It takes a request gives it a uuid and passes it on to the specific service provider.

var Hapi = require('hapi');
var r = require('request');
var post = r.post;
var get = r;
var uuid = require('uuid');

var server = new Hapi.Server();
server.connection({ port: 3000 });

var servicelist = []; //store all the active services
var serviceidcount = 0;

//service request from the outside
server.route({
	method: 'GET',
	path: '/request/{service}',
	handler: function (request, reply) {
		var r = {
			uuid: uuid.v4(),
			service: request.params.service
		};

		var possible_services = servicelist.filter(function(s){
			return s.service_name === r.service;
		});

		if(possible_services.length > 0){
			post(possible_services[0].url+"/request", {form:r},function(err,httpResponse,body){
				reply(httpResponse.body);
			});
		} else {
			reply("unknown service");
		}

	}
});

//show overview of all the services
server.route({
	method: 'GET',
	path: '/services',
	handler: function (request, reply) {
		reply(servicelist);
	}
});


//register a serviceprovider
server.route({
	method: 'POST',
	path: '/registerService',
	handler: function (request, reply) {
		console.log("Registered new service: " + request.payload.service_name);
		var s = {
			url: request.payload.url,
			service_name: request.payload.service_name,
			description: request.payload.description,
			service_code: serviceidcount++,
			health: "up"
		};

		servicelist.push(s);
		reply(s);
	}
});

//unregister a serviceprovider
server.route({
	method: 'POST',
	path: '/unregisterService',
	handler: function (request, reply) {
		var toremove = servicelist.findIndex(function(s){
			return s.service_id === request.payload.service_id;
		});

		if(toremove>-1){

			console.log("Unregistered service: " + servicelist[toremove].service_name);
			servicelist.splice(toremove, 1);
			reply("unregistered from gateway!");
		} else {
			console.log("failed to unregister service " + request.payload.service_id);
			reply("unknown service id");
		}
	}
});

server.start(function(err) {
	if (err) {throw err;}
	//console.log('Server running at: '+server.info.uri);
});

//ping for healthchecks
//setInterval(function(){
//	servicelist.map(function(service, i){
//
//		get(service.url, {timeout: 1000, time: true}, function(err,httpResponse,body){
//			if(err) {
//				servicelist[i].health = "down";
//			} else {
//				servicelist[i].health = "up "+httpResponse.elapsedTime+"ms";
//			}
//		});
//	});
//},1000);
