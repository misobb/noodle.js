/**
 * we are using 1 character member name for space and memory usage
 */

function defineModels(mongoose, fn) {
  var Schema    = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

    /****************************************************************************
     * User
     ***************************************************************************/
    var User = new Schema({
      _id : { type: String, index: { unique: true } },  // unique id
      n   : String                                      // nickname
    });

    User.method('generateNickname', function() {
      var firstparts = [
        'Black',
        'Good',
        'Red',
        'Blue',
        'Sweet',
        'Storm',
        'Big',
        'Little',
        'Strong',
        'Smart',
        'Brave'
      ];

      var secondparts = [
        'Snake',
        'Bird',
        'Dog',
        'Cat',
        'Rain',
        'Forest',
        'Square',
        'Crown',
        'Hope',
        'Wind',
        'Fire',
        'Water',
        'Ball',
        'Doll'
      ];

      var first   = firstparts[Math.floor(Math.random() * (firstparts.length -1))];
      var second  = secondparts[Math.floor(Math.random() * (secondparts.length - 1))];
      return first + second;
    });

    User.pre('save', function(next) {
      if (! this._id) {
        var nb    = require('./utilities').str_pad(Math.ceil(Math.random() * 2176782336), 9, 0, 'STR_PAD_RIGHT');
        this._id  = require('./utilities').baseConverter(nb, 10, 36);
      }
      next();
    });

    mongoose.model('User', User);
    
  /****************************************************************************
   * Discussion
   ***************************************************************************/
   
  var Discussion = new Schema({
    _id  : { type: String, index: { unique: true } }, // unique id
    t   : String,                                     // title
    m   : {                                           // message (last)
      n : String,                                     // nickname (user)
      b : String,                                     // body
      d : String                                      // date (created)
    },
    u   : [User]
  });

  Discussion.pre('save', function(next) {
    if (! this._id) {
      var nb    = require('./utilities').str_pad(Math.ceil(Math.random() * 2176782336), 9, 0, 'STR_PAD_RIGHT');
      this._id  = require('./utilities').baseConverter(nb, 10, 36);
    }
    next();
  });
  
  mongoose.model('Discussion', Discussion);

  /****************************************************************************
   * Message
   ***************************************************************************/
  
  var Message = new Schema({
    i : { type: String, index: true },  // discussion_id
    u : {                               // user (author)
      i : String,                       // user_id
      n : String                        // nickname 
    },
    b : String,                         // body
    d : String                          // date (created)
  });
  
  mongoose.model('Message', Message);

  fn();
}

exports.defineModels = defineModels; 
