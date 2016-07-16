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
.controller('LoginCtrl', function($scope, UserStorageService, $state, $ionicNavBarDelegate,$ionicLoading, $http) {
  $ionicNavBarDelegate.showBackButton(false);
  $scope.animateClass = 'button-positive';
  $scope.doLogin = function(email, password) {
    if (!email) {
      return;
    }
    if (!password) {
      return;
    }
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Signing In!'
      });
    $http.get('http://api.postoncloud.com/api/ShipMart/ValidateAndSignIn?EmailId='+email+'&PhoneNumber=&Password='+password+'&Status=5')
            .success(function(result) {
              if(result[0].UserId!='User does not exists'){
                console.log(result);
                $state.go('app.location');
                UserStorageService.add(email);
              }
              else{
                $scope.animateClass = 'button-assertive';
              }
            })
            .finally(function() {
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
            });
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
  
})
.controller('DataGridCtrl', function($scope, UserStorageService, $state, $ionicNavBarDelegate,$http) {
    $scope.gridOptions = {
     enableSorting: true,
      enableFiltering : true,
      paginationPageSizes: [2, 4, 8],
       paginationPageSize: 4,
     columnDefs: [
       { field: 'AdDescription', enableColumnMenu: false,enableFiltering : false},
       { field: 'CatName',  enableColumnMenu: false,enableFiltering : false},
       { field: 'Id',  enableColumnMenu: false,enableFiltering : false},
       { field: 'Measurment',  enableColumnMenu: false,enableFiltering : false},
       { field: 'Price',  enableColumnMenu: false,enableFiltering : false},
       { field: 'Unit',  enableColumnMenu: false,enableFiltering : false},
     ],
     enableGridMenu: false,
     exporterPdfDefaultStyle: {fontSize: 9},
   exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
   exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
   exporterPdfHeader: { text: 'PlanetData', style: 'headerStyle' },
   exporterPdfFooter: function ( currentPage, pageCount ) {
     return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
   },
   exporterPdfCustomFormatter: function ( docDefinition ) {
     docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
     docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
     return docDefinition;
   },
   exporterPdfOrientation: 'landscape',
   exporterPdfPageSize: 'LETTER',
   exporterPdfMaxGridWidth: 500,
   onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
};
   $http.get('//api.postoncloud.com/api/ServiesPostOnCloud/ServiceList?UserID=1')
     .success(function(data) {
       console.log(data);
       $scope.gridOptions.data = data;
     });
});