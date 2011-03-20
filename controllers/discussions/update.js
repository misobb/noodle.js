module.exports = function (req, res) {
  Discussion.findOne({ _id: req.body.discussion_id }, function(err, discussion) {
    discussion.t = req.body.title;
    discussion.save(function(err) {
      switch (req.params.format) {
        case 'json':
          res.send({status: 'OK', results: {discussion: discussion}});
        break;
        default:
          res.redirect('/discussions/update/' + discussion._id);
      }
    });
  });
}