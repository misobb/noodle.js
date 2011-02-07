var user = function()
{
  this.uid;
  this.nickname;

  /**
   * User create service
   * 
   * @param req
   * @param res
   */
  this.create = function(req, res)
  {
    this.uid = this.generateUid();
    this.nickname = this.generateNickname();
    this.avatar = Math.floor(Math.random() * 5).toString();

    var json = {nickname : this.nickname, userUid : this.uid, avatar: this.avatar};

    require('../database/mongo').insert('user', json, req, res);
  };

  /**
   * User update service
   * 
   * @param req
   * @param res
   */
  this.update = function(req, res)
  {
    this.nickname = require('url').parse(req.url, true).query.nickname;
    this.avatar = require('url').parse(req.url, true).query.avatar;
    this.userUid = require('url').parse(req.url, true).query.userUid;

    var json = {nickname : this.nickname, avatar: this.avatar, userUid: this.userUid};

    require('../database/mongo').update('user', {userUid: this.userUid}, json, req, res);    
  }

  /**
   * Generate user unique id
   *
   * @return string
   */
  this.generateUid = function()
  {
    var date = new Date();
    return date.getTime().toString();
  };

  /**
   * Generate user nickname the first time he connects
   *
   * @return string
   */
  this.generateNickname = function()
  {
    var names = [
      'Awesome',
      'Cool',
      'Happy',
      'Penguin',
      'Sad',
      'Super',
      'Mega',
      'Ultra',
      'Legendary',
      'Epic',
      'Fail',
      'Lol',
      'Nice',
      'Flower',
      'Troll',
      'BeMy',
      'PowerTo',
      'ILike',
      'Feeling',
      'Sweet',
      'Sour',
      'Special',
      'Heavy',
      'Dirty',
      'Ka',
      'Kikou',
      'Black',
      'Ugly',
      'Beauty',
    ];

    var name = names[Math.floor(Math.random() * names.length)];

    return name+'Miso';
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
  if(req.url.match(/^\/user\/create/))
  {
    return new user().create(req, res);
  }
  if(req.url.match(/^\/user\/update/))
  {
    return new user().update(req, res);
  }

  throw "The service " + req.url + " does not exists.";
}