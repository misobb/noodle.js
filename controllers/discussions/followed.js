var prettyDate = require('../../middleware/pretty_date');

module.exports = function(req, res) {
  Discussion.find({ 's.uid' : req.user._id })
  .sort('m.d', -1) // sort by last message date
  .execFind( function(err, discussions) {
    switch (req.params.format) {
      case 'json':
        res.send({status: 'OK', results: {discussions: discussions}});
      break;
      default:
        for (x=0; x<discussions.length; x=x+1) {
          discussions[x].doc.m.d = prettyDate(discussions[x].doc.m.d * 1000);
        }
        res.render('discussions/followed.jade', {
          locals: { discussions: discussions, title: 'Followed' }
        });
    }
  });
}