module.exports = function(req, res) {
  if (typeof req.body.title == 'undefined' || typeof req.body.message == 'undefined') {
    res.send({"status": "FAIL", "results": "title and message must be provided"});
  } else {
    var now         = (new Date().getTime()) / 1000;
    req.body.public = req.body.public == 'on' ? 1 : 0;
    var discussion  = new Discussion({
      t : req.body.title,
      p : req.body.public,
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
      n   : req.user.n,
      a   : req.user.a, 
      d   : now
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
          id  : req.user._id,
          n   : req.user.n,
          a   : req.user.a
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
}