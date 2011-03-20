/******************************************************************************
 * ROUTES CONFIGURATIONS
 *****************************************************************************/
var loadUser = require('../middleware/load_user');

exports.set = function(app){
  
  /****************************************************************************
   * DISCUSSIONS
   ***************************************************************************/
  // list public discussion
  app.get('/', require('./discussions/public'));
  app.get('/discussions/public.:format?', require('./discussions/public'));

  // list followed discussion
  app.get('/discussions/followed.:format?', loadUser, require('./discussions/followed'));
  
  // new discussion form
  app.get('/discussions/create', loadUser, require('./discussions/new'));
  
  // create discussion
  app.post('/discussions/create.:format?', loadUser, require('./discussions/create'));

  // read discussion
  app.get(/^(?:\/([0-9a-z]{6})?)?$/, loadUser, require('./discussions/read'));
  app.get('/discussions/read/:id.:format?', loadUser, require('./discussions/read'));
  
  /****************************************************************************
   * MESSAGES
   ***************************************************************************/
  // create a message inside a discussion
  app.post('/messages/create.:format?', loadUser, require('./messages/create'));
  
  /****************************************************************************
   * USERS
   ***************************************************************************/
  // create user
  app.get('/users/create.json', require('./users/create'));

  // update user
  app.post('/users/update.:format?', require('./users/update'));

  // create user
  app.get('/more', loadUser, require('./users/more'));

  // follow or unfollow a discussion without posting messages
  app.get('/users/toggle/:discussion_id.:format?', loadUser, require('./users/toggle'));
  
};