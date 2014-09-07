
// assets/javascripts/google_drive_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'ch.Vendor.Google'
  ];

  angular.module('ch.GoogleDrive', dependencies);

})(angular);

// assets/javascripts/google_auth.js
(function(angular) {

  angular.module('ch.GoogleDrive')
    .provider('googleAuth', googleAuthProvider);

  function googleAuthProvider() {
    var
      self = {},
      definitions;

    definitions = [
      '$q',
      'gapi',
      googleAuth
    ];

    self.clientId = '';
    self.$get = definitions;

    return self;

    function googleAuth($q, gapi){
      return {
        authorize: authorize
      };

      function authorize() {
        var
          deferred = $q.defer();

        if (gapi.auth) {
          loadAuthCallback();
        }
        else {
          gapi.load('auth', { callback: loadAuthCallback });
        }

        return deferred.promise;

        function loadAuthCallback() {
          var
            config;

          config = {
            client_id: self.clientId,
            scope: 'https://www.googleapis.com/auth/drive.readonly',
            immediate: false
          };

          gapi.auth.authorize(config, handleAuth);
        }

        function handleAuth(authResult) {
          if (authResult && !authResult.error) {
            accessToken = authResult.access_token;
            deferred.resolve(accessToken);
          }
          else {
            deferred.reject(authResult.error);
          }
        }
      }
    }
  }
})(angular);

// assets/javascripts/google_drive.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$q',
    'gapi',
    googleDrive
  ];

  angular.module('ch.GoogleDrive')
    .factory('googleDrive', definitions);

  function googleDrive($q, gapi) {
    return {
      getFile: getFile
    };

    function getFile(fileId) {
      var
        deferred = $q.defer();

      gapi.client.load('drive', 'v2', downloadFile);

      return deferred.promise;

      function downloadFile() {
        gapi.client.drive.files.get({ fileId: fileId })
          .execute(handleResponse);

        function handleResponse(resp) {
          var
            file;
            isGDoc = angular.isUndefined(resp.downloadUrl);

          file = {
            link: getUrl(resp),
            name: getFileName(resp),
            size: getFileSize(resp)
          };

          deferred.resolve(file);

          function getUrl(resp) {
            return isGDoc ? resp.exportLinks["application/rtf"] : resp.downloadUrl;
          }

          function getFileName(resp) {
            return isGDoc ? resp.title + '.rtf' : resp.title;
          }

          function getFileSize(resp) {
            return isGDoc ? 0 : resp.fileSize;
          }
        }
      }
    }

  }

})(angular);

// assets/javascripts/google_drive_manager.js
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










// assets/javascripts/google_picker.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$q',
    'gapi',
    googlePicker
  ];

  angular.module('ch.GoogleDrive')
    .factory('googlePicker', definitions);

  function googlePicker($q, gapi){

    return {
      load: load
    };

    function load(accessToken) {
      var
        deferred = $q.defer();

      gapi.load('picker', { callback: loadPickerCallback });

      return deferred.promise;

      function loadPickerCallback() {
        if (google && google.picker) {
          buildPicker(google.picker);
        }
        else {
          deferred.reject('google.picker failed to load');
        }
      }

      function buildPicker(pickerService) {
        var
          view = new pickerService.DocsView().setMode(pickerService.DocsViewMode.LIST),
          mimeTypes = 'application/rtf,application/msword,application/vnd.google-apps.document,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        return new pickerService.PickerBuilder()
            .enableFeature(pickerService.Feature.NAV_HIDDEN)
            .setSelectableMimeTypes(mimeTypes)
            .addView(view)
            .setOAuthToken(accessToken)
            .setCallback(pickerCallback)
            .build()
            .setVisible(true);

          function pickerCallback(data) {
            if (data[pickerService.Response.ACTION] === pickerService.Action.PICKED) {
              deferred.resolve(data[pickerService.Response.DOCUMENTS][0]);
            }
          }
      }
    }
  }
})(angular);

// assets/javascripts/vendor/google_module.js
(function(angular) {

  var
    dependencies = [],
    factoryDefinition;

  factoryDefinition = [
    '$window',
    gapi
  ];

  angular.module('ch.Vendor.Google', dependencies)
    .factory('gapi', factoryDefinition);

  function gapi($window) { return $window.gapi; }

})(angular);