angular.module('voice-counter.controllers').controller('WordSetCtrl', function (
  WordSets,
  $stateParams,
  WordSets,
  $translate,
  $scope
) {
  var $ctrl = this;

  $scope.$on('$ionicView.enter', function(e) {
    $ctrl.isNew = _.isUndefined($stateParams.wordSetId) || _.isEmpty($stateParams.wordSetId);
    if (!$ctrl.isNew) {
      $ctrl.wordSet = WordSets.get($stateParams.wordSetId);
    } else {
      $translate('UNTITLED').then(function (untitled) {
        $ctrl.wordSet = {
          name: untitled + ' ' + (WordSets.length() + 1),
          words: []
        };
        WordSets.add($ctrl.wordSet);
      });
    }
    $ctrl.newWord = '';
  });


  /**
   * Adds a word to the wordset and cleans the "new word" textbox.
   */
  $ctrl.addNewWord = function () {
    $ctrl.wordSet.words.push({text:$ctrl.newWord});
    $ctrl.newWord = '';
  };

  /**
   * removes a word from the wordset, and to prevent losing it, it adds it to the new word textbox so the user can
   * re-add it.
   * @param word is the word *object* to remove (includes the text as member)
   */
  $ctrl.remove = function (word) {
    $ctrl.newWord = _.remove($ctrl.wordSet.words, word).text;
  }
});
