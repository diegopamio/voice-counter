// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('voice-counter', [
  'ionic',
  'voice-counter.controllers',
  'voice-counter.services',
  'angularMoment',
  'pascalprecht.translate',
  'ngCookies',
  'ngStorage',
  'ngCordova',
  'angularUUID2'
])

.config(function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'i18n/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitize');
  $translateProvider.useLocalStorage();

})

.run(function($ionicPlatform, $rootScope, $translate, amMoment) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });


  $rootScope.$on('$translateChangeSuccess', function () {
    amMoment.changeLocale($translate.use());
  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    controllerAs: '$ctrl',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.sessions', {
    url: '/sessions',
    views: {
      'tab-sessions': {
        templateUrl: 'templates/tab-sessions.html',
        controllerAs: '$ctrl',
        controller: 'SessionsCtrl'
      }
    }
  })
  .state('tab.new-session', {
      url: '/sessions/new',
      views: {
        'tab-sessions': {
          templateUrl: 'templates/session.html',
          controllerAs: '$ctrl',
          controller: 'SessionCtrl'
        }
      }
  })
  .state('tab.session', {
    url: '/sessions/:sessionId',
    views: {
      'tab-sessions': {
        templateUrl: 'templates/session.html',
        controllerAs: '$ctrl',
        controller: 'SessionCtrl'
      }
    }
  })
  .state('tab.counter', {
    url: '/counter',
    views: {
      'tab-counter': {
        templateUrl: 'templates/tab-counter.html',
        controllerAs: '$ctrl',
        controller: 'CounterCtrl'
      }
    }
  })
  .state('tab.wordSet', {
    url: '/wordsSet/:wordSetId',
    views: {
      'tab-words': {
        templateUrl: 'templates/wordSet.html',
        controllerAs: '$ctrl',
        controller: 'WordSetCtrl'
      }
    }
  })
  .state('tab.words', {
    url: '/words',
    views: {
      'tab-words': {
        templateUrl: 'templates/tab-words.html',
        controllerAs: '$ctrl',
        controller: 'WordsCtrl'
      }
    }
  })
  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controllerAs: '$ctrl',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/counter');

}).directive('focusMe',['$timeout',function ($timeout) {
  return {
    link: function (scope, element, attrs) {
      if (attrs.focusMeDisable === "true") {
        return;
      }
      $timeout(function () {
        element[0].focus();
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.show(); //open keyboard manually
        }
      }, 350);
    }
  };
}]);
