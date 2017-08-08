
angular.module('voice-counter.services', [])
.factory('LocalStorageManager', function (uuid2, $localStorage) {
  return function(collectionName, initialValue) {
    var defaultValue = {};
    defaultValue[collectionName] = initialValue;
    var storage = $localStorage.$default(defaultValue);
    return {
      all: function () {
        return storage[collectionName];
      },
      remove: function (instance) {
        storage[collectionName].splice(storage.collection.indexOf(instance), 1);
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
  var sessions = [{
    id: uuid2.newguid(),
    date: new Date(),
    title: 'Untitled 1',
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

  return LocalStorageManager('sessions', sessions);
})

.factory('WordSets', function ($localStorage, $translate, LocalStorageManager, uuid2) {
  var defaultWordSets = {
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

  var wordSets = defaultWordSets;

  return LocalStorageManager('wordSets', wordSets[$translate.use()]);

})
.factory('Settings', function ($cordovaGlobalization, $translate, $ionicPlatform, $localStorage) {

  var storage = $localStorage;

  if (!storage.settings) {
    storage.settings = {
      language: 'auto'
    }
  } else {
    storage.settings.language = storage.settings.language || 'auto';
  }

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

  setLanguage(storage.settings.language);

  return {
    setLanguage: setLanguage
  }
});
