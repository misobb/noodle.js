module.exports = function(req, res) {
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
            discussion.s[x].d = now;
            break;
          }
        }
        if (! in_array) {
          discussion.s.push({ 
            uid : req.user._id, 
            n   : req.user.n,
            d   : now
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
              id  : req.user.id,
              n   : req.user.n,
              a   : req.user.a
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
}