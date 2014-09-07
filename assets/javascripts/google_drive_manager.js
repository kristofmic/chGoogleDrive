(function(angular) {

  var
    definitions;

  definitions = [
    'googleAuth',
    'googlePicker',
    'googleDrive',
    googleDriveManager
  ];

  angular.module('ch.GoogleDrive')
    .factory('googleDriveManager', definitions);

  function googleDriveManager(gAuth, gPicker, gDrive) {

    return init;

    function init() {
      var
        gAccessToken;

      return gAuth.authorize()
        .then(loadPicker)
        .then(getFile)
        .then(addAccessToken);

      function loadPicker(accessToken) {
        gAccessToken = accessToken;
        return gPicker.loadPicker(accessToken);
      }

      function getFile(gDoc) {
        return gDrive.getFile(gDoc.id);
      }

      function addAccessToken(gFile) {
        gFile.link += '&access_token=' + gAccessToken;
        return gFile;
      }
    }
  }

})(angular);








