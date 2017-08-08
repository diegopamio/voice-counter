//ToDo: split into different controller files.

/**
 * Plays a key using the Beep library.
 * @param keys is the (musical) key to play.
 */
function play(keys) {
  var key = keys.shift();
  if(_.isUndefined(key)) return; // song ended
  new Beep(22050).play(key[0], key[1], [Beep.utils.amplify(8000)], function() { play(keys); });
}

angular.module('voice-counter.controllers', []);
