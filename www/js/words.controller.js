angular.module('voice-counter.controllers').controller('WordsCtrl', function(WordSets) {
  var $ctrl = this;
  $ctrl.wordSets = WordSets.all();

  /**
   * Removes a session, it just calls the WordSets service to do it.
   * @param wordSet is the whole wordSet object, as stored in the WordSets service.
   */
  $ctrl.remove = function (wordSet) {
    WordSets.remove(wordSet);
  }
});
