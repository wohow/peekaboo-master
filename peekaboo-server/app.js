
var pomelo = require('pomelo');
var test = require('./app/domain/test');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'peekaboo-server');

// app configuration
app.configure('production|development', 'connector', function(){
  	app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      // heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });

  	var channel = app.get('channelService').createChannel('gameChannel');
  	test.startup(channel, 20);
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
