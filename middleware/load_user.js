var decodeBase64 = require('./decode_base64');

module.exports = function(req, res, next) { 
   switch (req.params.format) {
     case 'json':
       if (! req.headers.authorization) {
         res.send({"status": "FAIL", "results": "http basic authentication required"});
         res.end();
       }
       var basic_auth = decodeBase64(req.headers.authorization);
       if (! basic_auth) {
         res.send({"status": "FAIL", "results": "wrong basic authentication"});
         res.end();
       }
       var user_id = basic_auth.user_id;
     break;
     default:
       var user_id = req.cookies.userid;
     break;
   }
   User.findById(user_id, function(err, user) {
     if (!user) {
       user    = new User();
       user.n  = user.generateNickname();
       user.a  = '/images/avatar_' + Math.floor(Math.random() * 4) + '.png';
       user.save(function() {
         var past = new Date() + 9999999999;
         res.cookie('userid', user._id, { 
           expires   : new Date(past), 
           httpOnly  : true,
           path      : '/'
         });
         req.user = user;
         next();
       });
     } else {
       req.user = user;
       next();
     }
   });
}