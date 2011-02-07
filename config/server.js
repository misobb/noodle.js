exports.get = function()
{
  return {
    host : 'localhost',
    port : 1337,
    mongo : {
      host : 'localhost',
      port : 27017,
      path : '/usr/local/lib/node/mongodb'
    }
  }
};
