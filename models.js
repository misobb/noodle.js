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
  
  Discussion.virtual('title')
    .set(function(title) { this.t = title; })
    .get(function() { return this.t; });

  Discussion.virtual('message')
    .set(function(message) { this.m = message; })
    .get(function() { return this.m; });

  Discussion.virtual('message.nickname')
    .set(function(nickname) { this.m.n = nickname; })
    .get(function() { return this.m.n; });
    
  Discussion.virtual('message.date')
    .set(function(date) { this.m.d = date; })
    .get(function() { return this.m.d; });
    
  Discussion.virtual('message.body')
    .set(function(body) { this.m.b = body; })
    .get(function() { return this.m.b; });
  
  mongoose.model('Discussion', Discussion);

  /****************************************************************************
   * Message
   ***************************************************************************/
  
  var Message = new Schema({
    i : { type: String, index: true },  // discussion_id
    u : {                               // user (author)
      i : String,                       // user_id
      p : String                        // pseudo 
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
