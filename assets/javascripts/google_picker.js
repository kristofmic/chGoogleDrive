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