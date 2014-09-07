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