angular.module('voice-counter.controllers').controller('CounterCtrl', function (
  $scope,
  $ionicModal,
  WordSets,
  Sessions,
  $translate,
  $cordovaDialogs,
  $filter,
  $stateParams
) {
  var $ctrl = this;

  $scope.$on('$ionicView.enter', function(e) {
    //Generic selection modal that serves as a basis to either select a session to resume or a wordset to start.
    $ionicModal.fromTemplateUrl('templates/select-option-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      if ($stateParams.new) {
        $ctrl.newSession();
      } else if ($stateParams.sessionId) {
        $ctrl.session = Sessions.get($stateParams.sessionId);
        $ctrl.startRecording();

      }
    })
  });



  /**
   * Discards the current session (if it is a new one).
   */
  $ctrl.deleteSession = function () {
    $translate([
      'counter.removeSessionConfirm.TITLE',
      'counter.removeSessionConfirm.SUB_TITLE',
      'counter.removeSessionConfirm.YES',
      'counter.removeSessionConfirm.NO']).then(function (translations) {

      $cordovaDialogs.confirm(
        translations['counter.removeSessionConfirm.SUB_TITLE'],
        translations['counter.removeSessionConfirm.TITLE'],
        [translations['counter.removeSessionConfirm.YES'], translations['counter.removeSessionConfirm.NO']]).then(function (buttonIndex) {
        if (buttonIndex === 1) {
          Sessions.remove($ctrl.session);
          delete $ctrl.session;
        }
      });
    });



  };

  /**
   * Starts the recording (listening for words).
   * Resets all the commands in annyang (speech recognition library) and maps the session words to annyang
   * commands in the form of:
   *    {
   *       <wordToRecognize>: <functionToExecute>
   *    }
   * Finally, plays the "start" tones, and setup the "ok" and "fail" recognition tones.
   */
  $ctrl.startRecording = function () {
    $ctrl.isRecording = true;
    var commands = _.fromPairs(
      _.map($ctrl.session.words, function (word) {
        return [
          word.text,
          function () {
            $scope.$apply(function () {
              word.count = word.count? word.count + 1: 1;
            });
          }
        ];
      }));

    annyang.removeCommands();
    annyang.addCommands(commands);
    annyang.setLanguage($translate.use());
    annyang.start({ autoRestart: true, continuous: false });
    play([[660, 0.1], [660, 0.1], [660, 0.1], [510, 0.1], [660, 0.1], [770, 0.1], [1, 0.1], [380, 0.1]]);
    if (annyang) {

      annyang.addCallback('resultMatch',function() {
        play([[660, 0.1]]);
      });
      annyang.addCallback('resultNoMatch',function() {
        play([[770, 0.1], [380, 0.1]]);
      });
    }
  }

  /**
   * Actually STOPS the annyang (pause is used to not freak the user (thanks to user research) and updates the model
   * isRecording variable accordingly.
   */
  $ctrl.pauseRecording = function () {
    $ctrl.isRecording = false;
    annyang.abort();
  }

  /**
   * Creates a new session from a set of words and starts recording.
   *
   * Uses the scope's modal defined earlier.
   * Maps the wordsets to title/subtitle/id tuples for the modal.
   * After the option has been selected the words are added to a new unnamed session with the current date, and
   * the controller starts the recording (listening) of words.
   * The "newSessionModal" type is used by the modal to select titles localized strings.
   */
  $ctrl.newSession = function() {
    $translate('words.WORDS').then(function (wordsLiteral) {
      $scope.type = 'newSessionModal'; //ToDo: provide the already translated text from here instead of using the type
      $scope.options = _.map(WordSets.all(), function (wordSet) {
        return {
          title: wordSet.name,
          subtitle: '(' + wordSet.words.length + ' ' + wordsLiteral + ')',
          id: wordSet.id
        };
      });
      $scope.selectOption = function(wordSetId) {
        $ctrl.session = {
          date: new Date()
        };
        _.merge($ctrl.session, {words: WordSets.get(wordSetId).words}); // used merge to clone the words and prevent
                                                                        // modifying the wordset "template" ones.
        $scope.modal.hide();
        $ctrl.session = Sessions.add($ctrl.session);
        $ctrl.startRecording();
      };
      $scope.modal.show();
    });
  };

  /**
   * Loads an existing session from a set of words and starts recording.
   *
   * Uses the scope's modal defined earlier.
   * Maps the sessions words to title/subtitle/id tuples for the modal.
   * After the option has been selected the session is assigned as the current one, and the controller starts the
   * recording (listening) of words.
   * The "resumeSessionModal" type is used by the modal to select titles localized strings.
   */
  $ctrl.resumeSession = function() {
    $translate('session.DATE_LABEL').then(function (dateLabelLiteral) {
      $scope.type = 'resumeSessionModal';//ToDo: provide the already translated text from here instead of using the type
      $scope.options = _.map(Sessions.all(), function (session) {
        return {
          title: session.title,
          subtitle: dateLabelLiteral + ' ' + $filter('amTimeAgo')(session.date),
          id: session.id
        };
      });
      $scope.selectOption = function(sessionId) {
        $ctrl.session = Sessions.get(sessionId);
        $scope.modal.hide();
        $ctrl.startRecording();
      };
      $scope.modal.show();
    });
  };

  /**
   * Uses the Sessions controller to reset all the word counts to 0
   */
  $ctrl.resetCounters = function () {
    Sessions.resetCounters($ctrl.session.id);
  }
  /**
   * Adds a new word to the current session using an ionicPopup.
   * As the "addCommands" annyang function can be called over an existing set of commands, adding a new word will work
   * even without interrupting the listening status.
   */
  $ctrl.addNewWord = function () {
    $translate([
      'counter.addNewWord.TITLE',
      'counter.addNewWord.SUB_TITLE',
      'counter.addNewWord.CANCEL',
      'counter.addNewWord.ADD']).then(function (translations) {

      $cordovaDialogs.prompt(
        translations['counter.addNewWord.SUB_TITLE'],
        translations['counter.addNewWord.TITLE'],
        [translations['counter.addNewWord.CANCEL'], translations['counter.addNewWord.ADD']]).then(function (result) {
        if (result.buttonIndex === 2) {
          var newWord = {text: result.input1, count: 0}
          $ctrl.session.words.push(newWord);
          var command = {}
          command[newWord.text] = function () {
            $scope.$apply(function () {
              newWord.count = newWord.count? newWord.count + 1: 1;
            });
          }
          annyang.addCommands(command);
        }
      });
    });
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

});
