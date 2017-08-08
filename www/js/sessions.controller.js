angular.module('voice-counter.controllers').controller('SessionsCtrl', function(
  Sessions,
  $scope,
  $translate,
  $ionicListDelegate,
  $cordovaDialogs
) {
  var $ctrl = this;
  $scope.$on('$ionicView.enter', function(e) {
    $ctrl.sessions = Sessions.all();
  });

  /**
   * Removes a session, it just calls the Session service to do it.
   * @param session is the whole session object, as stored in the Session service.
   */
  $ctrl.remove = function (session) {
    Sessions.remove(session);
  }

  /**
   * Renames a session (title) using a ionic popup.
   * @param session is the whole session object to rename its title.
   */
  $ctrl.rename = function (session) {
    $translate([
      'sessions.rename.TITLE',
      'sessions.rename.SUB_TITLE',
      'sessions.rename.CANCEL',
      'sessions.rename.OK']).then(function (translations) {
      var result = $cordovaDialogs.prompt(
        translations['sessions.rename.SUB_TITLE'],
        translations['sessions.rename.TITLE'],
        [translations['sessions.rename.CANCEL'], translations['sessions.rename.OK']],
        session.title || '').then(function (result) {
        if (result.buttonIndex === 1) {
          session.title = result.input1;
        }
        $ionicListDelegate.closeOptionButtons();

      });
    });
  }
});
