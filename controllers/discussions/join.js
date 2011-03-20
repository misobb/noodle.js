module.exports = function (req, res) {
  Discussion.findOne({ _id: req.body.discussion_id }, function(err, discussion) {
    if (! discussion) {
      req.session.error = 'discussion does not exist';
      res.redirect('/more');
    } else {
      res.redirect('/' + discussion._id);
    }
  });
}