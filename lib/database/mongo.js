var config = require('../../config/server').get();

/**
 * Insert a document in mongo collection
 *
 * @param collectionName
 * @param json
 * @param req
 * @param res
 */
exports.insert = function(collectionName, json, req, res)
{
  var config = require('../../config/server').get();
  var Db = require(config.mongo.path).Db;
  var Server =  require(config.mongo.path).Server;

  var db = new Db('misobb', new Server(config.mongo.host, config.mongo.port, {}), {});

  db.open(function(err, db) {
    db.collection(collectionName, function(err, collection)
    {
      collection.insert(json,  function(err, doc)
      {
        db.close();

        res.writeHead(200, {'Content-Type': 'application/json'});
        var resultString = '{"status": "SUCCESS", "results": ' + JSON.stringify(doc) + '}';
        res.end(resultString);
      });
    });
  });
}

/**
 * Update a document in a mongo collection
 *
 * @param collectionName
 * @param search search criteria of document
 * @param json new document (complete)
 * @param req
 * @param res
 */
exports.update = function(collectionName, search, json, req, res)
{
  var config = require('../../config/server').get();
  var Db = require(config.mongo.path).Db;
  var Server =  require(config.mongo.path).Server;

  var db = new Db('misobb', new Server(config.mongo.host, config.mongo.port, {}), {});

  db.open(function(err, db) {
    db.collection(collectionName, function(err, collection)
    {
      collection.update(search, json,  function(err, doc)
      {
        db.close();

        res.writeHead(200, {'Content-Type': 'application/json'});
        var resultString = '{"status": "SUCCESS", "results": ' + JSON.stringify([doc]) + '}';
        res.end(resultString);
      });
    });
  });
}

/**
 * Ask for a list of document
 *
 * @param collectionName
 * @param json
 * @param res
 */
exports.find = function(collectionName, json, res)
{
  var config = require('../../config/server').get();
  var Db = require(config.mongo.path).Db;
  var Server =  require(config.mongo.path).Server;

  var db = new Db('misobb', new Server(config.mongo.host, config.mongo.port, {}), {});

  var a = [];
  db.open(function(err, db) {
    db.collection(collectionName, function(err, collection){
      collection.find(json, function(err, cursor) {
        cursor.toArray(function(err, items){

          res.writeHead(200, {'Content-Type': 'application/json'});
          var resultString = '{"status": "SUCCESS", "results": ' + JSON.stringify(items) + '}';

          db.close();
          res.end(resultString);
        });
      });
    });
  });
}

/**
 * Ask for a single document
 *
 * @param collectionName
 * @param json
 * @param res
 */
exports.findOne = function(collectionName, json, res)
{
  var config = require('../../config/server').get();
  var Db = require(config.mongo.path).Db;
  var Server =  require(config.mongo.path).Server;

  var db = new Db('misobb', new Server(config.mongo.host, config.mongo.port, {}), {});

  var a = [];
  db.open(function(err, db) {
    db.collection(collectionName, function(err, collection){
      collection.find(json, function(err, cursor) {
        cursor.toArray(function(err, items){
          if(items.length > 1)
          {
            items = [items[0]];
          }
          res.writeHead(200, {'Content-Type': 'application/json'});
          var resultString = '{"status": "SUCCESS", "results": ' + JSON.stringify(items) + '}';

          db.close();
          res.end(resultString);
        });
      });
    });
  });
}