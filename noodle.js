var config = require('./config/server').get();

console.log('Server is running on '+config.host+':'+config.port+'...');

var http = require('http');
http.createServer(function (req, res) {
  try
  {
    require('./lib/service').handle(req, res);
  }
  catch(exception)
  {
    //error handling
    console.log('[500] Unexpected error on ' + req.url + ' !');
    console.log('Details: ' + exception);
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end('{"status" : "FAIL"}');
  }
}).listen(config.port, config.host);