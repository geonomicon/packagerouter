//all controllers are defined here 
//AppCtrl for Logout Process, uses StorageFactories to create User Sessions
angular.module('packagerouter.controllers', [])

.controller('AppCtrl', function($scope, UserStorageService, $state, $ionicNavBarDelegate) {
  $ionicNavBarDelegate.showBackButton(false);
  $scope.$on('$ionicView.enter', function() {
    if (UserStorageService.getAll().length > 0) {
      $scope.loggedIn = UserStorageService.getAll()[0];
      $scope.isLoggedIn = true;
    }
    else {
      $scope.isLoggedIn = false;
    }
  });
  $scope.doLogout = function() {
    UserStorageService.removeAll();
    $state.go('app.login');
  };
})

//Login 
.controller('LoginCtrl', function($scope, UserStorageService, $state, $ionicNavBarDelegate) {
  $ionicNavBarDelegate.showBackButton(false);
  $scope.doLogin = function(username, password) {
    if (!username) {
      console.log($scope.username);
    }
    if (!password) {
      console.log($scope.password);
    }
    UserStorageService.add(username);
    $state.go('app.location');
  }

})

.controller('LogoutCtrl', function($scope, UserStorageService, $state, $ionicNavBarDelegate) {


})

.controller('LocationCtrl', function($scope, UserStorageService, $state, $ionicNavBarDelegate, $cordovaGeolocation, $ionicLoading, $http, LocationStorageService) {
  $scope.refreshLocation = function() {
    LocationStorageService.removeAll();
    getLocationAndAddress();
  }
    var getLocationAndAddress = function() {
    ionic.Platform.ready(function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
      });

      var posOptions = {
        enableHighAccuracy: true,
        timeout: 2000000,
        maximumAge: 0
      };
      if (LocationStorageService.getAll().length < 1) {
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
          $scope.lat = position.coords.latitude;
          $scope.lng = position.coords.longitude;
          $http.get('//api.opencagedata.com/geocode/v1/json?q=' + $scope.lat + '+' + $scope.lng + '&key=' + $scope.GeoCodingAPIKey)
            .success(function(result) {
              $scope.address = result.results[0].formatted;
              location.lat = $scope.lat;
              location.lng = $scope.lng;
              location.add = result.results[0].formatted;
              LocationStorageService.add(location);
              console.log(result);
            })
            .finally(function() {
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
            });

        }, function(err) {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          console.log(err);
        });
      }
      else {
        $scope.lat = LocationStorageService.getAll()[0].lat;
        $scope.lng = LocationStorageService.getAll()[0].lng;
        $scope.address = LocationStorageService.getAll()[0].add;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };
  $scope.GeoCodingAPIKey = '93d639c2f2e101a955c9dd2ec8704fca';
  var location = {
    lat: null,
    lng: null,
    add: null
  };
  $ionicNavBarDelegate.showBackButton(false);
  $scope.$on('$ionicView.enter', function() {
    if (UserStorageService.getAll().length < 1) {
      $state.go('app.login');
    }
    else{
      getLocationAndAddress();
    }
  });
  
});
