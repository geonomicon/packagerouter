//all controllers are defined here
//AppCtrl for Logout Process, uses StorageFactories to create User Sessions
angular.module('packagerouter.controllers', [])

.controller('AppCtrl', function($scope, UserIdStorageService, UserStorageService, $state,
  $ionicNavBarDelegate,
  $http,
  $localStorage,
  $ionicLoading) {
  $ionicNavBarDelegate.showBackButton(false);
  $scope.$on('$ionicView.enter', function() {
    if (UserStorageService.getAll().length > 0) {
      $scope.loggedIn = UserStorageService.getAll()[0];
      $scope.isLoggedIn = true;
    } else {
      $scope.isLoggedIn = false;
    }
  });
  $scope.doLogout = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Logging Out!'
    });
    $http.get('http://api.postoncloud.com/api/ShipMart/DeleteVendorExecutive?UserID=' + UserIdStorageService.getAll()[0])
      .success(function(result) {
        console.log(result);
        UserStorageService.removeAll();
        UserIdStorageService.removeAll();
        $state.go('app.login');
      })
      .finally(function() {
        $ionicLoading.hide();
      });

  };
  $scope.acceptedOr = function() {
    $state.go('app.location', {
      isAccepted: true,
      isRejected: false,
      isOrder: false
    });
  }

  $scope.normalOr = function() {
    $state.go('app.location', {
      isAccepted: false,
      isRejected: false,
      isOrder: true
    });
  }

  $scope.rejectedOr = function() {
    $state.go('app.location', {
      isAccepted: false,
      isRejected: true,
      isOrder: false
    });
  }

})

//Login
.controller('LoginCtrl', function($scope, $ionicSideMenuDelegate, UserIdStorageService, UserStorageService, $state, $ionicNavBarDelegate, $ionicLoading, $http) {
  $ionicSideMenuDelegate.canDragContent(false);
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
    $http.get('http://api.postoncloud.com/api/ShipMart/ValidateAndSignIn?EmailId=' + email + '&PhoneNumber=&Password=' + password + '&Status=5')
      .success(function(result) {
        if (result[0].UserId != 'User does not exists') {
          console.log(result);
          $state.go('app.location');
          UserStorageService.add(email);
          UserIdStorageService.add(result[0].UserId);
        } else {
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

.controller('LocationCtrl', function($scope, UserIdStorageService, UserStorageService, $state, $ionicNavBarDelegate,
  $cordovaGeolocation,
  $ionicLoading, $http, LocationStorageService,
  OrderStorageService,
  $cordovaLocalNotification,
  Items,
  $localStorage,
  $ionicPlatform, $ionicPopup,
  $ionicHistory) {
  // NOtifications Section
  // ionic.Platform.ready(function() {
  //   $cordovaLocalNotification.add({
  //     id: 1,
  //     date: new Date(),
  //     message: "Everything Working Fine",
  //     title: "Ship24x",
  //     autoCancel: true
  //   }).then(function() {
  //     console.log("The notification has been set");
  //   });
  // });



  $scope.isAccepted = $state.params.isAccepted;
  $scope.isRejected = $state.params.isRejected;
  $scope.isNormalOr = $state.params.isOrder;

  $scope.items = [];
  $scope.refreshLocation = function() {
    LocationStorageService.removeAll();
    getLocationAndAddress();
  }

  $scope.ordersList = function(item) {
    $state.go('app.order', {
      item: item
    });
  }
  $scope.acceptedOr = function(item) {
    $state.go('app.accepted', {
      item: item
    });
  }
  $scope.rejectedOr = function(item) {
    $state.go('app.rejected', {
      item: item
    });
  }

  $scope.GeoCodingAPIKey = '93d639c2f2e101a955c9dd2ec8704fca';

  var getLocationAndAddress = function() {
    ionic.Platform.ready(function() {
      var posOptions = {
        enableHighAccuracy: true,
        timeout: 2000000,
        maximumAge: 0
      };

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });
        $http.get('https://api.opencagedata.com/geocode/v1/json?q=' + $scope.lat + '+' + $scope.lng + '&key=' + $scope.GeoCodingAPIKey)
          .success(function(result) {
            $scope.address = result.results[0].formatted;
            location.lat = $scope.lat;
            location.lng = $scope.lng;
            location.add = result.results[0].formatted;
            LocationStorageService.add(location);
            $http.get('http://api.postoncloud.com/api/ShipMart/AddCurrentUSerLocation?UserId=' + UserIdStorageService.getAll()[0] + '&Latitude=' + $scope.lat + '&Longlatitude=' + $scope.lng + '&Status=5&Type=1&CreatedBy=1')
              .success(function(miniresult) {
                $scope.result = 'Location Sent to Server';
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
              });
          })
      }, function(err) {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        console.log(err);
      });
    });
  };

  var location = {
    lat: null,
    lng: null,
    add: null
  };

  $ionicNavBarDelegate.showBackButton(false);

  $scope.$on('$ionicView.enter', function() {
    if (UserStorageService.getAll().length < 1) {
      $state.go('app.login');
    } else {
      getLocationAndAddress();
    }
  });

  $scope.items = Items;

  // Items.$watch(function(event) {
  //   if (event.event === 'child_added' && Items[Items.$indexFor(event.key)].currentPicker === UserIdStorageService.getAll()[0]) {
  //     for (var i = 0; i < Items[Items.$indexFor(event.key)].pickers.length; i++) {
  //       roamingTimeout = setTimeout(function(i, Items, event) {
  //         if (Items[Items.$indexFor(event.key)].pickedBy == null && !(Items[Items.$indexFor(event.key)].currentPickerIndex == (Items[Items.$indexFor(event.key)].pickers.length - 1))) {
  //           Items[Items.$indexFor(event.key)].currentPicker = Items[Items.$indexFor(event.key)].orignalBody.availabeExecutives[Items[Items.$indexFor(event.key)].currentPickerIndex + 1].userid;
  //           Items[Items.$indexFor(event.key)].currentPickerIndex++;
  //           Items.$save(Items.$indexFor(event.key)).then(function(ref) {
  //             ref.key() === Items[Items.$indexFor(event.key)].$id;
  //           });
  //         } else {
  //           console.log('Cannot be transferred');
  //           return;
  //         }
  //       }, 30000, i, Items, event);
  //
  //     }
  //     // });
  //   }
  // });

  $scope.hasRejected = function(item) {
    return Items[Items.$indexFor(item)].rejectedBy.indexOf(UserIdStorageService.getAll()[0]) >= 0;
  }

  $scope.isCurrentPicker = function(item) {
    if (angular.isUndefined(Items[Items.$indexFor(item)].availableExecutives)) return false;
    return Items[Items.$indexFor(item)].availableExecutives.indexOf(UserIdStorageService.getAll()[0]) >= 0;
  }

  $scope.isPickedByHim = function(item) {
    return Items[Items.$indexFor(item)].pickedBy == UserIdStorageService.getAll()[0];
  }

})

.controller('OrderCtrl', function($scope, $state, Items, UserIdStorageService, OrderStorageService, $http, $localStorage) {

  $scope.item = $state.params.item;
  $scope.accept = function(result) {
    $http.get('http://api.postoncloud.com/api/ShipMart/AddShipmentTracking?ShipmentID=' +
        $scope.item.orignalBody.ShipmentId + '&AssignTo=' + UserIdStorageService.getAll()[0] + '&Status=' + "Accepted")
      .success(function(innerResult) {
        console.log(innerResult);
        Items[Items.$indexFor(result)].pickedBy = UserIdStorageService.getAll()[0];
        Items[Items.$indexFor(result)].trackedBy = UserIdStorageService.getAll()[0];
        Items[Items.$indexFor(result)].currentPicker = "-1";
        Items[Items.$indexFor(result)].availableExecutives.length = 0;
        Items.$save(Items.$indexFor(result)).then(function(ref) {
          ref.key() === Items[Items.$indexFor(result)].$id;
        });
        $state.go('app.tracking');
      });
  }

  $scope.reject = function(result) {
    if (Items[Items.$indexFor(result)].currentPickerIndex == (Items[Items.$indexFor(result)].pickers.length - 1)) {
      console.log('Cannot be rejected');
      return;
    } else {
      $http.get('http://api.postoncloud.com/api/ShipMart/RejectShipmentList?ShipmentID=' + $scope.item.orignalBody.ShipmentId + '&AssignTo=' + UserIdStorageService.getAll()[0])
        .success(function(innerResult) {
          console.log(innerResult);
          var currentLocation = Items[Items.$indexFor(result)].availableExecutives.indexOf(UserIdStorageService.getAll()[0]);
          Items[Items.$indexFor(result)].availableExecutives.splice(currentLocation, 1);
          Items[Items.$indexFor(result)].rejectedBy.push(UserIdStorageService.getAll()[0]);
          Items[Items.$indexFor(result)].currentPicker = Items[Items.$indexFor(result)].orignalBody.availabeExecutives[Items[Items.$indexFor(result)].currentPickerIndex + 1].userid;
          Items[Items.$indexFor(result)].currentPickerIndex++;
          Items.$save(Items.$indexFor(result)).then(function(ref) {
            ref.key() === Items[Items.$indexFor(result)].$id;
            $state.go('app.location', {
              isAccepted: false,
              isRejected: true,
              isOrder: false
            });
          });
        });
    }
  }
})

.controller('acceptedCtrl', function($scope, $state, Items, UserIdStorageService, OrderStorageService, $http) {
  $scope.item = $state.params.item;
  console.log($scope.item);

})

.controller('RejectedCtrl', function($scope, $state, Items, UserIdStorageService, OrderStorageService, $http) {
  $scope.item = $state.params.item;
  console.log($scope.item);
})

.controller('TrackingCtrl', function($scope, $state, Items, UserIdStorageService, OrderStorageService, $http) {
  $scope.items = Items;
  $scope.isTrackedByHim = function(item) {
    return Items[Items.$indexFor(item)].trackedBy == UserIdStorageService.getAll()[0];
  }
  $scope.onItemClick = function(index) {
    var selectedItem = index;
    OrderStorageService.addAt(selectedItem.orignalBody);
    $state.go('app.tracker', {
      myParam: angular.copy(index.$id)
    });
  }
})

.controller('TrackerCtrl', function($ionicHistory, $ionicPlatform, $scope, UserStorageService, UserIdStorageService, $state, $ionicNavBarDelegate, OrderStorageService, $http, $localStorage, $stateParams, Items) {
  if (angular.isDefined(OrderStorageService.getAt()) && angular.isDefined(OrderStorageService.getAt().ShipmentId) && angular.isDefined(OrderStorageService.getCustom('trackerCount' + OrderStorageService.getAt().ShipmentId))) $scope.ct = OrderStorageService.getCustom('trackerCount' + OrderStorageService.getAt().ShipmentId);
  else $scope.ct = 1;
  if (angular.isDefined(OrderStorageService.getAt())) {
    viewTracking();
  } else {
    $state.go('app.location', {
      isAccepted: false,
      isRejected: false,
      isOrder: true
    });

  }

  function viewTracking() {
    $scope.isCOD = OrderStorageService.getAt().PaymentStatus == 'COD';
    if ($scope.isCOD) {
      var colorArr = ['button-assertive', 'button-positive', 'button-balanced', 'button-calm', 'button-energized', 'button-royal'];
      var percentArr = [0, 50, 100];
      var classChanger = [''];
      var statusTextArr = ['Accepted', 'Reached Vendor', 'Picked from Vendor', 'Reached Customer Premises', 'Delivered', 'Paid', null];
      var buttonTextArr = ['Accepted', 'Reached Vendor', 'Picked from Vendor', 'Reached Customer Premises', 'Delivered', 'Collect Payment', null];
    } else {
      var colorArr = ['button-assertive', 'button-positive', 'button-balanced', 'button-calm', 'button-energized'];
      var percentArr = [0, 50, 100];
      var classChanger = [''];
      var statusTextArr = ['Accepted', 'Reached Vendor', 'Picked from Vendor', 'Reached Customer Premises', 'Delivered', null];
      var buttonTextArr = ['Accepted', 'Reached Vendor', 'Picked from Vendor', 'Reached Customer Premises', 'Delivered', null];
    }

    if (angular.isUndefined(OrderStorageService.getAt())) {
      $scope.rangeColorPainters = 'range-royal';
      $scope.nothingToSeeHere = true;
    } else {
      $scope.item = OrderStorageService.getAt();
      console.log($scope.item);
      $scope.value = percentArr[0];
      $scope.statusColor = colorArr[0];
      $scope.showText = statusTextArr[$scope.ct - 1];
      $scope.buttonText = statusTextArr[$scope.ct];
      $scope.statusText = statusTextArr[$scope.ct];
    }

    $scope.updateStatus = function() {
      $http.get('http://api.postoncloud.com/api/ShipMart/AddShipmentTracking?ShipmentID=' +
      $scope.item.ShipmentId + '&AssignTo=' + UserIdStorageService.getAll()[0] + '&Status=' + $scope.statusText)
        .success(function(result) {
          console.log(result);
          $scope.ct++;
          OrderStorageService.putCustom('trackerCount' + OrderStorageService.getAt().ShipmentId, $scope.ct);
          $scope.value = percentArr[$scope.ct];
          $scope.statusColor = colorArr[$scope.ct];
          $scope.showText = statusTextArr[$scope.ct - 1];
          $scope.buttonText = buttonTextArr[$scope.ct];
          $scope.statusText = statusTextArr[$scope.ct];
          if ($scope.buttonText == 'Delivered') {
            $scope.amountVisible = true;
          }
          if ($scope.buttonText == null) {
            Items[Items.$indexFor($stateParams.myParam)].trackedBy = null;
            Items.$save(Items.$indexFor($stateParams.myParam)).then(function(ref) {
              ref.key() === Items[Items.$indexFor($stateParams.myParam)].$id;
              $scope.finalised = true;
            });
          }
        });

    }
    $scope.availableOnes = function() {
      $state.go('app.location', {
        isAccepted: false,
        isRejected: false,
        isOrder: true,
      });
    }


    $scope.changeClass = function(status) {
      if (status == $scope.ct) {
        return 'energized';
      }
    }
  }
});
