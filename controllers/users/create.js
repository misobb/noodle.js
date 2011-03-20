module.exports = function(req, res){
  user    = new User();
  user.n  = user.generateNickname();
  user.save(function() {
    res.send({status: 'OK', results: {user: user}});
  });
}