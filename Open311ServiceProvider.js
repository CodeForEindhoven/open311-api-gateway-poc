//This is the pubsub it stores and keeps track of changes in requests
var Hapi = require('hapi');
var Exiting = require('exiting');
var post = require('request').post;

var syncrequest = require('sync-request');

var server = new Hapi.Server();
var gateway = "http://localhost:3000";


var service_id = -1;

function setup(options){
	gateway = options.gateway;

	server.connection();

	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply) {
			reply("hello!");
		}
	});

	server.route({
		method: 'POST',
		path: '/request',
		handler: function (request, reply) {
			options.onrequest(request.payload, reply);
		}
	});


	server.on('stop', function() {
		console.log("stopping "+service_id);
		var response = syncrequest('POST', gateway+'/unregisterService', {json:{
			service_id: service_id
		}});
	});

	new Exiting.Manager(server).start(function(err) {
		if (err) {throw err;}
		console.log("server running at:" + server.info.uri);
		//register with gateway
		post(gateway+'/registerService',
			 {form:{
				 url: server.info.uri,
				 service_name: options.service_name,
				 description: options.description
			 }},
			 function(err,httpResponse,body){
				 console.log(httpResponse.body);
				 service_id = JSON.parse(httpResponse.body).service_id;
			 }
		 );
	});

}

module.exports = setup;
