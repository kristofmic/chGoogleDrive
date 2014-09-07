describe('googleDrive', function() {
  var
    service;

  beforeEach(module('ch.GoogleDrive'));

  beforeEach(module(function($provide) {
    mockDriveResponse = {
      downloadUrl: 'foobar',
      title: 'foo',
      fileSize: 100
    };

    mockDriveRequest = {
      execute: function(callback) {
        callback(mockDriveResponse);
      }
    };

    mockGApi = {
      client: {
        load: function(name, version, callback) {
          callback();
        },
        drive: {
          files: {
            get: function(fileConfig) {
              return mockDriveRequest;
            }
          }
        }
      }
    };

    $provide.value('gapi', mockGApi);
    spyOn(mockGApi.client, 'load').andCallThrough();
    spyOn(mockGApi.client.drive.files, 'get').andCallThrough();
    spyOn(mockDriveRequest, 'execute').andCallThrough();
  }));

  beforeEach(inject(function($injector) {
    service = $injector.get('googleDrive');
  }));

  it('should exist', function() {
    expect(service).toBeDefined();
  });

  describe('getFile()', function() {
    it('should load the drive interface', function() {
      service.getFile();

      expect(mockGApi.client.load).toHaveBeenCalled();
    });

    it('should return a promise that resolves to the file', function() {
      service.getFile('foobar')
        .then(function(file) {
          expect(file.link).toEqual(mockDriveResponse.downloadUrl);
          expect(file.name).toEqual(mockDriveResponse.title);
          expect(file.size).toEqual(mockDriveResponse.fileSize);
        });

      expect(mockGApi.client.drive.files.get).toHaveBeenCalledWith({fileId: 'foobar'});
      expect(mockDriveRequest.execute).toHaveBeenCalled();
    });

  });

});