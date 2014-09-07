describe('googleAuth', function() {
  var
    mockAuthorization,
    mockGApi,
    service;

  beforeEach(module('ch.GoogleDrive'));

  beforeEach(module(function($provide) {
    mockGApi = {
      auth: {
        authorize: function(config, callback) {
          callback(mockAuthorization);
        }
      }
    };

    $provide.value('gapi', mockGApi);
    spyOn(mockGApi.auth, 'authorize').andCallThrough();
  }));

  beforeEach(inject(function($injector) {
    service = $injector.get('googleAuth');
  }));

  it('should exist', function() {
    expect(service).toBeDefined();
  });

  describe('authorize()', function() {
    it('should authorize the app and user', function() {
      mockAuthorization = { access_token: 'foobar' };
      service.authorize();

      expect(mockGApi.auth.authorize).toHaveBeenCalled();
    });

    it('should return a promise that resolves with the access token', function() {
      mockAuthorization = { access_token: 'foobar' };

      service.authorize()
        .then(function(accessToken) {
          expect(accessToken).toEqual('foobar');
        });
    });

    it('should resolve to an error when the google api failed to authorize', function() {
      mockAuthorization = { error: 'fubar' };

      service.authorize()
        .catch(function(error) {
          expect(error).toEqual('fubar');
        });
    });
  });

});