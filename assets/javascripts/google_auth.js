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