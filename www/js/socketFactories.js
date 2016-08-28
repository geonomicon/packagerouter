angular.module('packagerouter.socketfactories', [])
.factory('Items', function($firebaseArray) {
  var itemsRef = new Firebase("https://dharasabha.firebaseio.com");
  return $firebaseArray(itemsRef);
});