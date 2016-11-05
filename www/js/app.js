// Read this carefully before modifying................
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'packagerouter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'packagerouter.controllers' is found in controllers.js
// In case of failure contact Rajat Sharma "lunasunkaiser@gmail.com"
angular.module('packagerouter', [
  'ionic',
  'ionic.service.core',
  'ngCordova',
  'ngStorage',
  'packagerouter.controllers',
  'packagerouter.storagefactories',
  'packagerouter.socketfactories',
  'firebase'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.run(function($ionicPlatform, $ionicHistory, $state, $ionicPopup) {
    $ionicPlatform.registerBackButtonAction(function() {
      if ($state.params.isOrder) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Exit App',
          template: 'Are you sure you want to exit the App?'
        });

        confirmPopup.then(function(res) {
          if (res) {
            navigator.app.exitApp();
          } else {
            console.log('You are not sure');
          }
        });
      } else {
        if ($ionicHistory.currentStateName() === 'app.tracker') {
          $state.go('app.location', {
            isAccepted: false,
            isRejected: false,
            isOrder: true
          });
        } else {
          $ionicHistory.goBack();
        }

      }
    }, 100);
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('app.tracker', {
        url: '/tracker',
        cache: false,
        params: {
          myParam: null
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/tracker.html',
            controller: 'TrackerCtrl'
          }
        }
      })
      .state('app.order', {
        url: '/order',
        cache: false,
        params: {
          item: null
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/order.html',
            controller: 'OrderCtrl'
          }
        }
      })
      .state('app.location', {
        url: '/sendlocation',
        cache: false,
        params: {
          isAccepted: false,
          isRejected: false,
          isOrder: true
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/location.html',
            controller: 'LocationCtrl'
          }
        }
      })

    .state('app.accepted', {
      url: '/acceptedorder',
      cache: false,
      params: {
        item: null
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/accepted.html',
          controller: 'acceptedCtrl'
        }
      }
    })

    .state('app.rejected', {
      url: '/rejectedorder',
      cache: false,
      params: {
        item: null
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/rejected.html',
          controller: 'RejectedCtrl'
        }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/sendlocation');
  });
