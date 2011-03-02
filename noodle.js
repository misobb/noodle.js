/******************************************************************************
 * DEPENDANCIES
 *****************************************************************************/

var express = require('express'),
  connect = require('connect@0.5.10'),
  jade = require('jade@0.6.3'),
  mongoose = require('mongoose@1.1.0')
  sys = require('sys'),
  path = require('path'),
  models = require('./models'),
  app = module.exports = express.createServer();

/******************************************************************************
 * CONFIGURATIONS
 *****************************************************************************/
 
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.cookieDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('test', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-uri', 'mongodb://localhost/misobb-test');
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-uri', 'mongodb://localhost/misobb-development');
});

app.configure('production', function() {
  app.use(express.errorHandler());
  app.set('db-uri', 'mongodb://localhost/misobb');
});

/******************************************************************************
 * MODELS
 *****************************************************************************/
 
models.defineModels(mongoose, function() {
  app.Discussion  = Discussion  = mongoose.model('Discussion');
  app.Message     = Message     = mongoose.model('Message');
  app.User        = User        = mongoose.model('User');
  db = mongoose.connect(app.set('db-uri'));
})


/******************************************************************************
 * MIDDLEWARE
 *****************************************************************************/

/******************************************************************************
 * ROUTES
 *****************************************************************************/

// list discussions
app.get('/discussions/public.:format?', function(req, res) {
  Discussion.find({})
  .sort('m.d', -1)
  .execFind( function(err, discussions) {
    switch (req.params.format) {
      case 'json':
        res.send(discussions.map(function(discussions) {
          return discussions;
        }));
      break;
      default:
        res.render('discussions/index.jade', {
          locals: { discussions: discussions, title: 'List of discussions' }
        });
    }
  });
});

// create discussion
app.get('/discussions/create', function(req, res) {
  res.render('discussions/create.jade', {
    locals: { discussion: new Discussion(), title: 'Create a new discussion' }
  });
});

app.post('/discussions/create.:format?', function(req, res) {
  var now         = new Date().getTime();
  var discussion = new Discussion({
    t : req.body.discussion.title,
    m : {
      d : now,
      b : req.body.discussion.message
    }
  });
  discussion.save(function() {
    new Message({
      i: discussion._id,
      b: req.body.discussion.message,
      d: now
    }).save();
    switch (req.params.format) {
      case 'json':
        res.send(discussion);
      break;
      default:
        res.redirect('/discussions/read/' + discussion._id);
    }
  });
});

// read discussion
app.get('/discussions/read/:id.:format?', function(req, res) {
  Discussion.findOne({ _id: req.params.id }, function(err, discussion) {
    Message.find({ i: req.params.id })
    .sort('d', -1)
    .execFind( function(err, messages) {
      switch (req.params.format) {
        case 'json':
          res.send(discussion);
        break;
        default:
          res.render('discussions/read.jade', {
            locals: { discussion: discussion, messages: messages, title: discussion.t}
          });
      }
    });
  });
});

// update discussion
app.post('/discussions/update/:id.:format?', function(req, res) {
  Discussion.findOne({ _id: req.params.id }, function(err, discussion) {
    var now         = new Date().getTime();
    discussion.m.p  = now;
    discussion.m.b  = req.body.discussion.message;
    discussion.m.d  = now;
    discussion.save(function() {
      new Message({
        i: discussion._id,
        b: req.body.discussion.message,
        d: now
      }).save();
      switch (req.params.format) {
        case 'json':
          res.send(discussion);
        break;
        default:
          res.redirect('/discussions/read/' + req.params.id);
      }
    });
  });
});

/******************************************************************************
 * LAUNCH
 *****************************************************************************/
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
