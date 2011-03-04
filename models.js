/**
 * we are using 1 character member name for space and memory usage
 * getters and setters for conveniance
 */

function defineModels(mongoose, fn) {
  var Schema    = mongoose.Schema,
      ObjectId  = Schema.ObjectId;

  /******************************************************************************
   * UTILITIES
   *****************************************************************************/

  function baseConverter (number,ob,nb) {
  	// Created 1997 by Brian Risk.  http://brianrisk.com
  	number = number.toUpperCase();
  	var list = "0123456789abcdefghijklmnopqrstuvwxyz";
  	var dec = 0;
  	for (var i = 0; i <=  number.length; i++) {
  		dec += (list.indexOf(number.charAt(i))) * (Math.pow(ob , (number.length - i - 1)));
  	}
  	number = "";
  	var magnitude = Math.floor((Math.log(dec))/(Math.log(nb)));
  	for (var i = magnitude; i >= 0; i--) {
  		var amount = Math.floor(dec/Math.pow(nb,i));
  		number = number + list.charAt(amount); 
  		dec -= amount*(Math.pow(nb,i));
  	}
  	return number;
  }
  
  function str_pad (input, pad_length, pad_string, pad_type) {
      // http://kevin.vanzonneveld.net
      // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // + namespaced by: Michael White (http://getsprink.com)
      // +      input by: Marco van Oort
      // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
      // *     example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
      // *     returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
      // *     example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
      // *     returns 2: '------Kevin van Zonneveld-----'
      var half = '',
          pad_to_go;

      var str_pad_repeater = function (s, len) {
          var collect = '',
              i;

          while (collect.length < len) {
              collect += s;
          }
          collect = collect.substr(0, len);

          return collect;
      };

      input += '';
      pad_string = pad_string !== undefined ? pad_string : ' ';

      if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH') {
          pad_type = 'STR_PAD_RIGHT';
      }
      if ((pad_to_go = pad_length - input.length) > 0) {
          if (pad_type == 'STR_PAD_LEFT') {
              input = str_pad_repeater(pad_string, pad_to_go) + input;
          } else if (pad_type == 'STR_PAD_RIGHT') {
              input = input + str_pad_repeater(pad_string, pad_to_go);
          } else if (pad_type == 'STR_PAD_BOTH') {
              half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
              input = half + input + half;
              input = input.substr(0, pad_length);
          }
      }

      return input;
  }

  /****************************************************************************
   * Discussion
   ***************************************************************************/
   
  var Discussion = new Schema({
    _id  : { type: String, index: { unique: true } },  // unique id
    t   : String,                                     // title
    m   : {                                           // message (last)
      n : String,                                     // nickname (user)
      b : String,                                     // body
      d : Date                                        // date (created)
    },
    u   : [{                                          // users (members)
      i : String,                                     // user_id
      n : String                                      // nickname (member)
    }]
  });

  Discussion.pre('save', function(next) {
    if (! this._id) {
      var nb = str_pad(Math.ceil(Math.random() * 2176782336), 9, 0, 'STR_PAD_RIGHT');
      this._id = baseConverter(nb, 10, 36);
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
    d : Date                            // date (created)
  });
  
  mongoose.model('Message', Message);
  
  /****************************************************************************
   * User
   ***************************************************************************/
  var User =   new Schema({
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
      var nb = str_pad(Math.ceil(Math.random() * 2176782336), 9, 0, 'STR_PAD_RIGHT');
      this._id = baseConverter(nb, 10, 36);
    }
    next();
  });
  
  mongoose.model('User', User);

  fn();
}

exports.defineModels = defineModels; 
