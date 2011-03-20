var loadUser = require('../../middleware/load_user');

module.exports = function(req, res, next){
  req.form.uploadDir = __dirname + '/../../public/images/avatars/';
  req.form.complete(function(err, fields, files){
    if (err) {
      next(err);
    } else {
      loadUser(req, res, function(){
        User.findById(req.user._id, function(err, user) {
          if (!user) {
            res.send({"status": "FAIL", "results": "user doesn't exists"});
          } else {
            user.n = fields.nickname;
            user.a = files.avatar.path.substr(
              req.form.uploadDir.length - 40,
              files.avatar.path.length
            );
            user.save(function (err){
              switch (req.params.format) {
                case 'json':
                  res.send({status: 'OK', results: {user: user}});
                break;
                default:
                  res.redirect('/more');
                break;
              }
            });
          }
        });
      });
    }
  });
  res.redirect('/more');
}