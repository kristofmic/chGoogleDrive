describe('googleDriveManager', function() {
  var
    mockPromise,
    mockFile,
    mockGAuth,
    mockGPicker,
    mockGDrive,
    scope,
    service;

  beforeEach(module('ch.GoogleDrive'));

  beforeEach(module(function($provide) {
    mockFile = {
      link: 'link',
      url: 'url',
      name: 'name'
    };

    mockPromise = (function() {
      var
        self;

      self = {
        then: function(callback) {
          callback(mockFile);
          return self;
        },
        catch: function() {}
      };

      return self;

    })();

    mockGAuth = {
      authorize: function() {
        return mockPromise;
      }
    };
    spyOn(mockGAuth, 'authorize').andCallThrough();

    mockGPicker = {
      loadPicker: function() {
        return mockPromise;
      }
    };
    spyOn(mockGPicker, 'loadPicker').andCallThrough();

    mockGDrive = {
      getFile: function() {
        return mockPromise;
      }
    };
    spyOn(mockGDrive, 'getFile').andCallThrough();

    $provide.value('googleAuth', mockGAuth);
    $provide.value('googlePicker', mockGPicker);
    $provide.value('googleDrive', mockGDrive);
  }));

  beforeEach(inject(function($injector, $rootScope) {
    scope = $rootScope.$new();

    service = $injector.get('googleDriveManager');
  }));

  it('should exist', function() {
    expect(service).toBeDefined();
  });

  describe('init()', function() {

    beforeEach(function() {
      service();
    });

    it('should authorize the app and user', function() {
      expect(mockGAuth.authorize).toHaveBeenCalled();
    });

    it('should load the picker', function() {
      expect(mockGPicker.loadPicker).toHaveBeenCalled();
    });

    it('should get the file from drive', function() {
      expect(mockGDrive.getFile).toHaveBeenCalled();
    });

  });
});



