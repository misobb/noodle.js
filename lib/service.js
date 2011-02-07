/**
 * Generic service handling
 *
 * @param req
 * @param res
 */
exports.handle = function(req, res)
{
  //bypass some urls
  switch(req.url)
  {
    case '/favicon.ico' :
      return {ignore: true};
  }

  var regexp = /^\/([a-z]+)/;
  var result = regexp.exec(req.url);
  if(result !== null)
  {
    return require('./services/'+result[1]).handle(req, res);
  }
  
  throw "The service " + req.url + " does not exists.";
}