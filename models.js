/**
 * we are using 1 character member name for space and memory usage
 * getters and setters for conveniance
 */

function defineModels(mongoose, fn) {
  var Schema    = mongoose.Schema,
      ObjectId  = Schema.ObjectId;

  /****************************************************************************
   * Discussion
   ***************************************************************************/
   
  var Discussion = new Schema({
    t : { type: String, index: true },  // title
    m : {                               // message (last)
      n : String,                       // nickname (user)
      b : String,                       // body
      d : Date                          // date (created)
    },
    u : [{                              // users (members)
      i : String,                       // user_id
      n : String                        // nickname (member)
    }]
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
    d : Date                            // date (created)
  });
  
  mongoose.model('Message', Message);
  
  /****************************************************************************
   * User
   ***************************************************************************/
  var User =   new Schema({
    n : String                          // nickname
  });
  
  User.method('generateNickname', function() {
    var firstparts = [
      'Black',
      'White',
      'Red',
      'Blue',
      'Green',
      'Storm',
      'Big',
      'Little',
      'Strong',
      'Smart'
    ];

    var secondparts = [
      'Snake',
      'Bird',
      'Dog',
      'Cat',
      'Fox',
      'Forest',
      'Horse',
      'Crown',
      'Hammer',
      'Wind',
      'Fire',
      'Water'
    ];

    var first   = firstparts[Math.floor(Math.random() * (firstparts.length -1))];
    var second  = secondparts[Math.floor(Math.random() * (secondparts.length - 1))];
    return first + second;
  });
  
  mongoose.model('User', User);

  fn();
}

exports.defineModels = defineModels; 
