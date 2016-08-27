// Read this carefully before modifying................
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'packagerouter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'packagerouter.controllers' is found in controllers.js
// In case of failure contact Rajat Sharma "lunasunkaiser@gmail.com"
angular.module('packagerouter', ['ionic','ionic.service.core','ngCordova','ngStorage','btford.socket-io','packagerouter.controllers','packagerouter.storagefactories','packagerouter.socketfactories','firebase'])

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
    params: {myParam: null},
    views: {
      'menuContent': {
        templateUrl: 'templates/tracker.html',
        controller: 'TrackerCtrl'
      }
    }
  })
  .state('app.order', {
    url: '/order',
    params: {item: null},
    views: {
      'menuContent': {
        templateUrl: 'templates/order.html',
        controller: 'OrderCtrl'
      }
    }
  })
  .state('app.location', {
    url: '/sendlocation',
    views: {
      'menuContent': {
        templateUrl: 'templates/location.html',
        controller: 'LocationCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/sendlocation');
});
