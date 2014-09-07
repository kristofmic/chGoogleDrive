describe('googlePicker', function() {
  var
    $window,
    gPicker,
    mockGApi,
    mockGoogle,
    mockData,
    scope;

  beforeEach(module('ch.GoogleDrive'));

  beforeEach(module(function($provide) {
    mockGApi = {
      load: function(name, config) {
        config.callback();
      }
    };

    $provide.value('gapi', mockGApi);
    spyOn(mockGApi, 'load').andCallThrough();
  }));

  beforeEach(inject(function($injector, $rootScope) {
    mockData = {
      action: 'picked',
      docs: [{ id: 'foo' }]
    };

    mockGoogle = (function () {
      var
        picker;

      picker = {
        PickerBuilder: function() {
          var
            self;

          self = {
            enableFeature: mockReturn,
            setSelectableMimeTypes: mockReturn,
            addView: mockReturn,
            setOAuthToken: mockReturn,
            setCallback: function(callback) {
              setTimeout(function() {
                callback(mockData);
              }, 500);
              return self;
            },
            build: mockReturn,
            setVisible: mockReturn
          };

          return self;

          function mockReturn() {
            return self;
          }
        },
        DocsView: function() {
          return {
            setMode: function() {

            }
          };
        },
        DocsViewMode: {
          LIST: 'foo'
        },
        Feature: {
          NAV_HIDDEN: 'bar'
        },
        Response: {
          ACTION: 'action',
          DOCUMENTS: 'docs'
        },
        Action: {
          PICKED: 'picked'
        }
      };

      return {
        picker: picker
      };
    })();
    spyOn(mockGoogle.picker, 'PickerBuilder').andCallThrough();

    $window = $injector.get('$window');
    $window.google = mockGoogle;

    scope = $rootScope;

    gPicker = $injector.get('googlePicker');
  }));

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it('should exist', function() {
    expect(gPicker).toBeDefined();
  });

  describe('load()', function() {
    it('should load the picker service', function() {
      gPicker.load(123);

      expect(mockGApi.load).toHaveBeenCalled();
      expect(mockGApi.load.mostRecentCall.args[0]).toEqual('picker');
    });

    it('should return a promise that resolves to the picked file data', function() {
      var
        resolvedData;

      gPicker.load(123)
        .then(function(data) {
          resolvedData = data;
        });

      jasmine.Clock.tick(501);

      scope.$apply();

      expect(resolvedData).toEqual({id: 'foo'});
    });

    it('should resolve to an error when the google picker failed to load', function() {
      $window.google = {};

      gPicker.load(123)
        .catch(function(error) {
          expect(error).toEqual('google.picker failed to load');
        });
    });
  });

});