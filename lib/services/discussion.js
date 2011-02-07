var discussion = function()
{
  this.discussionUid;
  this.title;

  /**
   * Discussion create service
   * 
   * @param req
   * @param res
   */
  this.create = function(req, res)
  {
    this.title = require('url').parse(req.url, true).query.title;
    this.discussionUid = this.generateUid();

    var json = {title : this.title, discussionUid : this.discussionUid};
    require('../database/mongo').insert('discussion', json, req, res);
  };

  /**
   * Get all messages in a single discussion
   *
   * @param req
   * @param res
   */
  this.read = function(req, res)
  {
    var discussionUid = require('url').parse(req.url, true).query.discussionUid;
    return require('../database/mongo').find('message', {discussionUid : discussionUid}, res);
  };

  /**
   * Retrieve one specific discussion
   * empty json array if not found
   * 
   * @param req
   * @param res
   */
  this.exist = function(req, res)
  {
    var discussionUid = require('url').parse(req.url, true).query.discussionUid;
    return require('../database/mongo').findOne('discussion', {discussionUid : discussionUid}, res);
  };

  /**
   * List all discussion
   *
   * @param req
   * @param res
   */
  this.list = function(req, res)
  {
    return require('../database/mongo').find('discussion', {}, res);
  };
  
  

  this.list = function(req)
  {
    conn = require('../database/mongo');
  };

  /**
   * Generate unique id
   *
   * @return string
   */
  this.generateUid = function()
  {
    var date = new Date();
    return date.getTime().toString();
  };

  return this;
}

/**
 * Generic service handling
 * 
 * @param req
 * @param res
 */
exports.handle = function(req, res)
{
  if(req.url.match(/^\/discussion\/create/))
  {
    return new discussion().create(req, res);
  }
  if(req.url.match(/^\/discussion\/list/))
  {
    return new discussion().list(req, res);
  }
  if(req.url.match(/^\/discussion\/read/))
  {
    return new discussion().read(req, res);
  }
  if(req.url.match(/^\/discussion\/exist/))
  {
    return new discussion().exist(req, res);
  }

  throw "The service " + req.url + " does not exists.";
}
