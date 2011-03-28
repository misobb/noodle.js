module.exports = function (req, res) {
  Discussion.findOne({ _id: req.params.id }, function(err, discussion) {
    switch (req.params.format) {
      case 'json':
        res.send({status: 'OK', results: {discussion: discussion}});
      break;
      default:
        res.render('discussions/qrcode.jade', {
          locals: {
            discussion : discussion
          }
        });
    }
  });
}