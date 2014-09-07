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