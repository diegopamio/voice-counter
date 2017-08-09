angular.module('voice-counter.controllers').controller('WordsCtrl', function(
  WordSets,
  $translate,
  $cordovaDialogs,
  $ionicListDelegate
) {
  var $ctrl = this;
  $ctrl.wordSets = WordSets.all();

  /**
   * Removes a session, it just calls the WordSets service to do it.
   * @param wordSet is the whole wordSet object, as stored in the WordSets service.
   */
  $ctrl.remove = function (wordSet) {
    WordSets.remove(wordSet);
  }

  /**
   * Renames a words set (title) using a native dialog.
   * @param wordSet is the whole wordSet object to rename its title.
   */
  $ctrl.rename = function (wordSet) {
    $translate([
      'words.rename.TITLE',
      'words.rename.SUB_TITLE',
      'words.rename.CANCEL',
      'words.rename.OK']).then(function (translations) {
      $cordovaDialogs.prompt(
        translations['words.rename.SUB_TITLE'],
        translations['words.rename.TITLE'],
        [translations['words.rename.CANCEL'], translations['words.rename.OK']],
        wordSet.name || '').then(function (result) {
        if (result.buttonIndex === 1) {
          wordSet.name = result.input1;
        }
        $ionicListDelegate.closeOptionButtons();

      });
    });
  }

});
