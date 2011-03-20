module.exports = function(req, res) {
  Discussion.findOne({ '_id' : req.body.discussion_id }, function(err, discussion) {
    var in_array = false;
    for (x = 0; x < discussion.s.length; x=x+1) {
      if (discussion.s[x].uid == req.user._id) {
        in_array = true;
        discussion.s[x].d = now;
        discussion.s(discussion.s.id[x]._id).remove();
        break;
      }
    }
    var now = (new Date().getTime()) / 1000;
    if (! in_array) {
      discussion.s.push({ 
        uid : req.user._id, 
        n   : req.user.n,
        d   : now
      });
    }
    redirect('/');
  });
}