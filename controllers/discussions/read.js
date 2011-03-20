var prettyDate = require('../../middleware/pretty_date');

module.exports = function (req, res) {
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
              messages[x].doc.d = prettyDate(messages[x].doc.d * 1000);
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