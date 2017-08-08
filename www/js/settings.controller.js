angular.module('voice-counter.controllers').controller('SettingsCtrl', function(
  $scope,
  $translate,
  $localStorage,
  Settings
) {
  var $ctrl = this;
  $ctrl.$storage = $localStorage;

  /**
   * Updates the Settings service with a newly selected language, only if there IS a new value and it is different from
   * the previous one.
   * @param newValue is the new language selected
   * @param oldValue is the old language as presented in this controller.
   */
  var changedLanguage = function (newValue, oldValue) { //ToDo: this is way tooo simple now, it should be just inlined
    // in the $watch call.
    if (newValue && newValue !== oldValue) {
      Settings.setLanguage(newValue);
    }
  };
  $scope.$watch('$ctrl.$storage.settings.language', changedLanguage)
});
