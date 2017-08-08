angular.module('voice-counter.controllers').controller('SessionCtrl', function($scope, $stateParams, Sessions, $translate, $cordovaMedia) {
  var $ctrl = this;
  $ctrl.session = Sessions.get($stateParams.sessionId);

})
