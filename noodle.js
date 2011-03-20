/******************************************************************************
 * DEPENDANCIES
 *****************************************************************************/

var express   = require('express'),
  connect     = require('connect'),
  jade        = require('jade'),
  mongoose    = require('mongoose')
  sys         = require('sys'),
  path        = require('path'),
  models      = require('./models'),
  form        = require('connect-form'),
  fs          = require('fs'),
  app         = express.createServer(
    form({ keepExtensions: true })
  );

/******************************************************************************
 * CONFIGURATIONS
 *****************************************************************************/
 
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "baka neko" }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('test', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-uri', 'mongodb://localhost/misobb-test');
});

app.configure('development', function() {
  app.set('port', 3000);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-uri', 'mongodb://localhost/misobb-development');
});

app.configure('production', function() {
  app.set('port', 80);
  app.use(express.errorHandler());
  app.set('db-uri', 'mongodb://localhost/misobb');
});

/******************************************************************************
 * MODELS
 *****************************************************************************/

models.defineModels(mongoose, function() { 
  app.User          = User          = mongoose.model('User'); 
  app.Subscription  = Subscription  = mongoose.model('Subscription');
  app.Discussion    = Discussion    = mongoose.model('Discussion');
  app.Message       = Message       = mongoose.model('Message');
  db = mongoose.connect(app.set('db-uri'));
})

/******************************************************************************
 * ROUTES
 *****************************************************************************/
 
require('./controllers/routes').set(app);

/******************************************************************************
 * LAUNCH
 *****************************************************************************/
if (!module.parent) {
  app.listen(app.set('port'));
  var now = new Date();
  console.log(now.toUTCString() + " noodle.js served on port %d", app.address().port)
}

process.on('uncaughtException',function(err){
  var now = new Date();
  console.log(now.toUTCString() + " " + err);
})
