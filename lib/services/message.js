var message = function()
{
  this.uid;
  this.message;
  this.userUid;
  this.userNickname;

  /**
   * Message create service
   * 
   * @param req
   * @param res
   */
  this.create = function(req, res)
  {
    var date = new Date();
    this.time = date.getTime();
    this.message = require('url').parse(req.url, true).query.message;
    this.userUid = require('url').parse(req.url, true).query.userUid;
    this.discussionUid = require('url').parse(req.url, true).query.discussionUid;
    this.nickname = require('url').parse(req.url, true).query.nickname;
    this.avatar = require('url').parse(req.url, true).query.avatar;
    this.uid = this.generateUid();

    var json = {
      message : this.message,
      userUid : this.userUid,
      discussionUid : this.discussionUid,
      nickname : this.nickname,
      avatar : this.avatar,
      time : this.time,
      uid : this.uid
    };

    require('../database/mongo').insert('message', json, req, res);
  };

  /**
   * Generate message unique id
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
  if(req.url.match(/^\/message\/create/))
  {
    return new message().create(req, res);
  }

  throw "The service " + req.url + " does not exists.";
}