module.exports = function(req, res){
  res.render('discussions/more.jade', {
    locals: {
      user  : req.user,
      title : 'Settings' 
    }
  });
}