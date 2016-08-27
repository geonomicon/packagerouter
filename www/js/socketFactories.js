angular.module('packagerouter.socketfactories', [])
.factory('Items', function($firebaseArray) {
  var itemsRef = new Firebase("https://gluon.firebaseio.com/items");
  return $firebaseArray(itemsRef);
});