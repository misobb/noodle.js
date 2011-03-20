module.exports = function(req, res) {
  res.render('discussions/create.jade', {
    locals: { 
      discussion  : new Discussion(),
      user        : req.user,
      title       : 'Create a new discussion' 
    }
  });
}