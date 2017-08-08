function play(keys) {
  var key = keys.shift();
  if(_.isUndefined(key)) return; // song ended
  new Beep(22050).play(key[0], key[1], [Beep.utils.amplify(8000)], function() { play(keys); });
}


angular.module('voice-counter.controllers', [])


.controller('SessionsCtrl', function(Sessions) {
  var $ctrl = this;
  $ctrl.sessions = Sessions.all();
  $ctrl.remove = function (session) {
    Sessions.remove(session);
  }
})

.controller('WordsCtrl', function(WordSets) {
  var $ctrl = this;
  $ctrl.wordSets = WordSets.all();
  $ctrl.remove = function (wordSet) {
    WordSets.remove(wordSet);
  }
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})
.controller('WordSetCtrl', function (WordSets, $stateParams, WordSets, $translate) {
  var $ctrl = this;
  $ctrl.isNew = _.isUndefined($stateParams.wordSetId);
  if (!$ctrl.isNew) {
    $ctrl.wordSet = WordSets.get($stateParams.wordSetId);
  } else {
    $translate('UNTITLED').then(function (untitled) {
      $ctrl.wordSet = {
        title: untitled + ' ' + (WordSets.length() + 1),
        words: []
      };
      WordSets.add($ctrl.wordSet);
    });
  }
  $ctrl.newWord = '';
  $ctrl.addNewWord = function () {
    $ctrl.wordSet.words.push({text:$ctrl.newWord});
    $ctrl.newWord = '';
  };

  $ctrl.remove = function (word) {
    _.remove($ctrl.wordSet.words, word);
  }
})
.controller('CounterCtrl', function ($scope, $ionicModal, WordSets, Sessions, $translate, $ionicPopup) {
  var $ctrl = this;
  $ionicModal.fromTemplateUrl('templates/select-option-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

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

  $ctrl.pauseRecording = function () {
    $ctrl.isRecording = false;
    annyang.abort();
  }
  $ctrl.newSession = function() {
    $translate('words.WORDS').then(function (wordsLiteral) {
      $scope.type = 'newSessionModal';
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
        _.merge($ctrl.session, {words: WordSets.get(wordSetId).words});
        $scope.modal.hide();
        $ctrl.startRecording();
      };
      $scope.modal.show();
    });
  };

  $ctrl.resumeSession = function() {
    $scope.type = 'resumeSessionModal';
    $scope.modal.show();
  };

  $ctrl.addNewWord = function () {
    $scope.data = {};

    $translate([
      'counter.addNewWord.TITLE',
      'counter.addNewWord.SUB_TITLE',
      'counter.addNewWord.CANCEL',
      'counter.addNewWord.ADD']).then(function (translations) {
      var addNewWordPopup = $ionicPopup.show({
        template: '<form><input type="text" ng-model="data.newWordText"></form>',
        title: translations['counter.addNewWord.TITLE'],
        subTitle: translations['counter.addNewWord.SUB_TITLE'],
        scope: $scope,
        buttons: [
          { text: translations['counter.addNewWord.CANCEL'] },
          {
            text: '<b>' + translations['counter.addNewWord.ADD'] + '</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.newWordText) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.newWordText;
              }
            }
          }
        ]
      });
      addNewWordPopup.then(function(newWordText) {
        var newWord = {text: newWordText, count: 0}
        $ctrl.session.words.push(newWord);
        var command = {}
        command[newWord.text] = function () {
          $scope.$apply(function () {
            newWord.count = newWord.count? newWord.count + 1: 1;
          });
        }
        annyang.addCommands(command);
      });
    })
  }
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})
.controller('SessionCtrl', function($scope, $stateParams, Sessions, $translate, $cordovaMedia) {
  var $ctrl = this;
  $ctrl.isNew = _.isUndefined($stateParams.sessionId);
  if (!$ctrl.isNew) {
    $ctrl.session = Sessions.get($stateParams.sessionId);
  } else {
    $translate('UNTITLED').then(function (untitled) {
      $ctrl.session = {
        date: new Date(),
        title: untitled + ' ' + (Sessions.length() + 1),
        words: []
      };
      Sessions.add($ctrl.session);
    });
  }
})

.controller('SettingsCtrl', function($scope, $translate, $localStorage, Settings) {
  var $ctrl = this;
  $ctrl.$storage = $localStorage;
  $ctrl.$storage.settings
  var changedLanguage = function (newValue, oldValue) {
    if (newValue && newValue !== oldValue) {
      Settings.setLanguage(newValue);
    }
  };
  $scope.$watch('$ctrl.$storage.settings.language', changedLanguage)
});
