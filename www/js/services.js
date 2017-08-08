
angular.module('voice-counter.services', [])
.factory('LocalStorageManager', function (uuid2, $localStorage) {
  /**
   * This is a factory function that represents an entity manager based on local storage.
   */
  return function(collectionName, initialValue) {
    var defaultValue = {};
    defaultValue[collectionName] = initialValue;
    var storage = $localStorage.$default(defaultValue);
    return {
      all: function () {
        return storage[collectionName];
      },
      remove: function (instance) {
        _.remove(storage[collectionName], instance);
      },
      get: function (instanceId) {
        return _.find(storage[collectionName], {id: instanceId});
      },
      length: function () {
        return storage[collectionName].length;
      },
      add: function (instance) {
        instance.id = uuid2.newuuid();
        storage[collectionName].push(instance);
        return instance;
      }
    }
  }
})
.factory('Sessions', function(LocalStorageManager, uuid2) {
  var demoSessions = [{
    id: uuid2.newguid(),
    date: new Date(),
    title: 'Demo Session',
    words: [
      {
        text: 'linfo', count: 4
      }
      ,
      {
        text: 'arte', count: 10
      }
    ]
  }];

  var sessionsManager = LocalStorageManager('sessions', demoSessions);

  var additionalFunctions = {
    /**
     * Resets all the word counts to 0.
     */
    resetCounters: function (sessionId) {
      _.forEach(sessionsManager.get(sessionId).words, function (word) {
        word.count = 0;
      });
    }
  }

  //Experimenting a little with "sort-of" "prototypical" inheritance.
  _.merge(sessionsManager, additionalFunctions);
  return sessionsManager;
})

.factory('WordSets', function ($localStorage, $translate, LocalStorageManager, uuid2) {
  var demoWordSets = {
    es: [
      {
        id: uuid2.newguid(),
        name: 'Vacío',
        words: []
      },
      {
        id: uuid2.newguid(),
        name: 'Por Defecto',
        words: [
          {text: 'linfo'},
          {text: 'blasto'}
        ]
      }
    ],
    en: [
      {
        id: uuid2.newguid(),
        name: 'Blank',
        words: []
      },
      {
        id: uuid2.newguid(),
        name: 'Default',
        words: [
          {text: 'linf'},
          {text: 'blast'}
        ]
      }
    ]
  };

  return LocalStorageManager('wordSets', demoWordSets[$translate.use()]);

})
.factory('Settings', function ($cordovaGlobalization, $translate, $ionicPlatform, $localStorage) {

  var storage = $localStorage;

  // Checks the localStorage for settings and then specifically for a language setting
  if (!storage.settings) {
    storage.settings = {
      language: 'auto'
    }
  } else {
    storage.settings.language = storage.settings.language || 'auto';
  }

  /**
   * Sets the language used by the translation engine (angular-translate) which will afterwards fire the
   * $translateChangeSuccess which is captured in the app.js module.run function to update also the localization of the
   * moment (date utility) library.
   *
   * If language cannot be determined, it fallsback to 'en'.
   *
   * @param langCode is either a string representing the language (en) code or locale code (en-US), or 'auto', to
   * trigger the automatic language detection provided by $cordovaGlobalization.
   */
  var setLanguage = function (langCode) {
    if (langCode === 'auto') {
      $ionicPlatform.ready(function() {
        if (navigator.globalization) {
          $cordovaGlobalization.getPreferredLanguage().then(
            function(language) {
              var lang = language.value.split("-")[0];
              $translate.use(lang);
              storage.settings.language = lang;
            },
            function(error) {
              $translate.use('en');
              storage.settings.language = 'en';
            }
          );
        } else {
          $translate.use('en');
          storage.settings.language = 'en';

        }
      });
    } else {
      $translate.use(langCode);
    }
  };

  //Initializes the language to whatever is in the localStorage.
  setLanguage(storage.settings.language);

  return {
    setLanguage: setLanguage
  }
});
