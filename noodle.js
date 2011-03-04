/******************************************************************************
 * DEPENDANCIES
 *****************************************************************************/

var express = require('express'),
  connect = require('connect@0.5.10'),
  jade = require('jade@0.6.3'),
  mongoose = require('mongoose@1.1.0')
  sys = require('sys'),
  path = require('path'),
  auth= require('connect-auth'),
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

function loadUser(req, res, next) { 
 
 console.log(req.cookies.userid);
  User.findById(req.cookies.userid, function(err, user) {
    if (!user) {
      user    = new User();
      user.n  = user.generateNickname();
      user.save(function() {
        res.cookie('userid', user._id, { 
          expires   : new Date() - 1, 
          httpOnly  : true,
          path      : '/'
        });
        
        console.log(req.cookies.userid);
        req.user = user;
        next();
      });
    } else {
      req.user = user;
      next();
    }
  });
}

/******************************************************************************
 * ROUTES
 *****************************************************************************/

// list publics discussions
app.get('/', function (req, res){
  res.redirect('/discussions/public');
});

app.get('/discussions/public.:format?', function(req, res) {
  Discussion.find({})
  .sort('m.d', -1) // sort by last message date
  .execFind( function(err, discussions) {
    switch (req.params.format) {
      case 'json':
        res.send(discussions.map(function(discussions) {
          return discussions;
        }));
      break;
      default:
        res.render('discussions/list.jade', {
          locals: { discussions: discussions, title: 'List of discussions' }
        });
    }
  });
});

// create discussion
app.get('/discussions/create', loadUser, function(req, res) {
  res.render('discussions/create.jade', {
    locals: { 
      discussion  : new Discussion(),
      user        : req.user,
      title       : 'Create a new discussion' 
    }
  });
});

app.post('/discussions/create.:format?', loadUser, function(req, res) {
  var now         = new Date().getTime();
  var discussion  = new Discussion({
    t : req.body.discussion.title,
    m : {
      n : req.user.n,
      d : now,
      b : req.body.discussion.message
    }
  });
  discussion.save(function(err) {
    if (err) {
      // uid not unique, retry
      discussion.save();
    }
    new Message({
      i: discussion._id,
      b: req.body.discussion.message,
      d: now,
      u: {
        i: req.user._id,
        n: req.user.n
      }
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
app.get(/^(?:\/([0-9a-z]{6})?)?$/, loadUser, readDiscussion); // shortcut

app.get('/discussions/read/:id.:format?', loadUser, readDiscussion);

function readDiscussion(req, res) {
  var discussion_id = req.params.id || req.params[0];
  Discussion.findOne({ _id: discussion_id }, function(err, discussion) {
    Message.find({ i: discussion_id })
    .sort('d', -1)
    .execFind( function(err, messages) {
      switch (req.params.format) {
        case 'json':
          res.send(discussion);
        break;
        default:
          res.render('discussions/read.jade', {
            locals: {
              user        : req.user,
              discussion  : discussion, 
              messages    : messages, 
              title       : discussion.t
            }
          });
      }
    });
  });
}

// update discussion
app.post('/discussions/update/:id.:format?', loadUser, function(req, res) {
  Discussion.findOne({ _id: req.params.id }, function(err, discussion) {
    var now         = new Date().getTime();
    discussion.m.n  = req.user.n;
    discussion.m.b  = req.body.discussion.message;
    discussion.m.d  = now;
    discussion.save(function() {
      new Message({
        i: discussion._id,
        b: req.body.discussion.message,
        d: now,
        u: {
          i: req.user.id,
          n: req.user.n
        }
      }).save();
      switch (req.params.format) {
        case 'json':
          res.send(discussion);
        break;
        default:
          res.redirect('/' + req.params.id);
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
