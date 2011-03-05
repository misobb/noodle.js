
// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../noodle'),
  assert = require('assert');

process.env.NODE_ENV = 'test';

module.exports = {
  'GET /': function(){
    assert.response(app,
      { url: '/' },
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
      function(res){
        assert.includes(res.body, '<title>Express</title>');
      });
  }
};