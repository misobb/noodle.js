module.exports = function(req, res){
  var flash = null;
  if (req.session.error && req.session.error.length) {
    flash = req.session.error;
    req.session.error = null
  }
  res.render('users/more.jade', {
    locals: {
      user  : req.user,
      title : 'Settings',
      flash : flash
    }
  });
}