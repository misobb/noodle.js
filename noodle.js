/******************************************************************************
 * DEPENDANCIES
 *****************************************************************************/

var express = require('express'),
  connect   = require('connect'),
  jade      = require('jade'),
  mongoose  = require('mongoose')
  sys       = require('sys'),
  path      = require('path'),
  models    = require('./models'),
  utils     = require('./utilities'),
  app       = module.exports = express.createServer();

/******************************************************************************
 * CONFIGURATIONS
 *****************************************************************************/
 
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
  app.User          = User          = mongoose.model('User'); 
  app.Subscription  = Subscription  = mongoose.model('Subscription');
  app.Discussion    = Discussion    = mongoose.model('Discussion');
  app.Message       = Message       = mongoose.model('Message');
  db = mongoose.connect(app.set('db-uri'));
})

/******************************************************************************
 * MIDDLEWARE
 *****************************************************************************/

function loadUser(req, res, next) { 
    switch (req.params.format) {
      case 'json':
        if (! req.headers.authorization) {
          res.send({"status": "FAIL", "results": "http basic authentication required"});
          res.end();
        }
        var basic_auth = utils.decodeBase64(req.headers.authorization);
        if (! basic_auth) {
          res.send({"status": "FAIL", "results": "wrong basic authentication"});
          res.end();
        }
        var user_id = basic_auth.user_id;
      break;
      default:
        var user_id = req.cookies.userid;
      break;
    }
    User.findById(user_id, function(err, user) {
      if (!user) {
        user    = new User();
        user.n  = user.generateNickname();
        user.save(function() {
          var past = new Date() + 9999999999;
          res.cookie('userid', user._id, { 
            expires   : new Date(past), 
            httpOnly  : true,
            path      : '/'
          });
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
app.get('/', publicDiscussion);

app.get('/discussions/public.:format?', publicDiscussion);

function publicDiscussion (req, res) {
  Discussion.find({})
  .sort('m.d', -1) // sort by last message date
  .execFind( function(err, discussions) {
    switch (req.params.format) {
      case 'json':
        res.send({status: 'OK', results: {discussions: discussions}});
      break;
      default:
        for (x=0; x<discussions.length; x=x+1) {
          discussions[x].doc.m.d = utils.prettyDate(discussions[x].doc.m.d * 1000);
        }
        res.render('discussions/public.jade', {
          locals: { discussions: discussions, title: 'List of discussions' }
        });
    }
  });
}

// list followed discussion
app.get('/discussions/followed.:format?', loadUser, function(req, res) {
  Discussion.find({ 's.uid' : req.user._id })
  .sort('m.d', -1) // sort by last message date
  .execFind( function(err, discussions) {
    switch (req.params.format) {
      case 'json':
        res.send({status: 'OK', results: {discussions: discussions}});
      break;
      default:
        for (x=0; x<discussions.length; x=x+1) {
          discussions[x].doc.m.d = utils.prettyDate(discussions[x].doc.m.d * 1000);
        }
        res.render('discussions/followed.jade', {
          locals: { discussions: discussions, title: 'Followed' }
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
  if (typeof req.body.title == 'undefined' || typeof req.body.message == 'undefined') {
    res.send({"status": "FAIL", "results": "title and message must be provided"});
  } else {
    var now         = (new Date().getTime()) / 1000;
    var discussion  = new Discussion({
      t : req.body.title,
      m : {
        u: {
          id : req.user._id,
          n   : req.user.n
        },
        d : now,
        b : req.body.message
      }
    });
    discussion.s.push({
      uid : req.user._id,
      n   : req.user.n
    });
    discussion.save(function(err) {
      if (err) {
        // uid not unique, retry
        console.log(err);
        discussion.save();
      }
      new Message({
        i: discussion._id,
        b: req.body.message,
        d: now,
        u: {
          id : req.user._id,
          n   : req.user.n
        }
      }).save();
      switch (req.params.format) {
        case 'json':
          res.send({status: 'OK', results: {discussion: discussion}});
        break;
        default:
          res.redirect('/discussions/read/' + discussion._id);
      }
    });
  } 
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
      if (err) {
        res.send({"status": "FAIL", "results": "discussion not found"});
      } else {
        switch (req.params.format) {
          case 'json':
            res.send({status: 'OK', results: {discussion: discussion,messages: messages}});
          break;
          default:
            for (x=0; x<messages.length; x=x+1) {
              messages[x].doc.d = utils.prettyDate(messages[x].doc.d * 1000);
            }
            res.render('discussions/read.jade', {
              locals: {
                user        : req.user,
                discussion  : discussion, 
                messages    : messages, 
                title       : discussion.t
              }
            });
        }
      }
    });
  });
}

// create a message inside a discussion
app.post('/messages/create.:format?', loadUser, function(req, res) {
  if (typeof req.body.discussion_id == 'undefined' || typeof req.body.message == 'undefined') {
    res.send({"status": "FAIL", "results": "discussion_id and message must be provided"});
  } else {
    Discussion.findOne({ _id: req.body.discussion_id }, function(err, discussion) {
      if (err) {
        res.send({"status": "FAIL", "results": "discussion not found"});
      } else {
        var now         = (new Date().getTime()) / 1000;
        discussion.m.u.id  = req.user.id;
        discussion.m.u.n  = req.user.n;
        discussion.m.b  = req.body.message;
        discussion.m.d  = now;
        var in_array = false;
        for (x = 0; x < discussion.s.length; x=x+1) {
          if (discussion.s[x].uid == req.user._id) {
            in_array = true;
            break;
          }
        }
        if (! in_array) {
          discussion.s.push({ 
            uid : req.user._id, 
            n   : req.user.n
          });
        }
        discussion.save(function(err) {
          if (err) {
            console.log(err);
          }
          var message = new Message({
            i: discussion._id,
            b: req.body.message,
            d: now,
            u: {
              id: req.user.id,
              n: req.user.n
            }
          });
          message.save(function(err) {
            if (err) {
              console.log(err);
            }
            switch (req.params.format) {
              case 'json':
                res.send({status: 'OK', results: {message: message}});
              break;
              default:
                res.redirect('/' + message.i);
            }
          });
        });
      }
    });
  }
});

// create user
app.get('/users/create.json', function(req, res){
  user    = new User();
  user.n  = user.generateNickname();
  user.save(function() {
    res.send({status: 'OK', results: {user: user}});
  });
});

// create user
app.get('/more', loadUser, function(req, res){
  res.render('discussions/more.jade', {
    locals: {
      user        : req.user,
      title       : 'Settings' 
    }
  });
});

/******************************************************************************
 * LAUNCH
 *****************************************************************************/
if (!module.parent) {
  app.listen(3000);
  var now = new Date();
  console.log(now.toUTCString() + " noodle.js served on port %d", app.address().port)
}

process.on('uncaughtException',function(err){
  var now = new Date();
  console.log(now.toUTCString() + " " + err);
})
