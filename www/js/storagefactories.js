//Storagefactories for short term storage

angular.module('packagerouter.storagefactories', [])

.factory('UserStorageService', function($localStorage) {
    $localStorage = $localStorage.$default({
        users: []
    });
    var _getAll = function() {
        return $localStorage.users;
    };
    var _add = function(user) {
        $localStorage.users.push(user);
    };
    var _remove = function(user) {
        $localStorage.users.splice($localStorage.things.indexOf(user), 1);
    };
    var _removeAll = function() {
        $localStorage.users = [];
    };
    return {
        getAll: _getAll,
        add: _add,
        remove: _remove,
        removeAll: _removeAll
    };
})

.factory('UserIdStorageService', function($localStorage) {
    $localStorage = $localStorage.$default({
        userIds: []
    });
    var _getAll = function() {
        return $localStorage.userIds;
    };
    var _add = function(userId) {
        $localStorage.userIds.push(userId);
    };
    var _remove = function(userId) {
        $localStorage.userIds.splice($localStorage.things.indexOf(userId), 1);
    };
    var _removeAll = function() {
        $localStorage.userIds = [];
    };
    return {
        getAll: _getAll,
        add: _add,
        remove: _remove,
        removeAll: _removeAll
    };
})

.factory('LocationStorageService', function($localStorage) {
    $localStorage = $localStorage.$default({
        locations: []
    });
    var _getAll = function() {
        return $localStorage.locations;
    };
    var _add = function(location) {
        $localStorage.locations.push(location);
    };

    var _remove = function(location) {
        $localStorage.locations.splice($localStorage.things.indexOf(location), 1);
    };
    var _removeAll = function() {
        $localStorage.locations = [];
    };

    return {
        getAll: _getAll,
        add: _add,
        remove: _remove,
        removeAll: _removeAll
    };
})

.factory('OrderStorageService', function($localStorage) {
    $localStorage = $localStorage.$default({
        Orders: [],
        Trackers : {current:undefined},
        customStore : {}
    });
    var _getAll = function() {
        return $localStorage.Orders;
    };
    var _add = function(Order) {
        $localStorage.Orders.push(Order);
    };
    var _addAt = function(Order) {
        $localStorage.Trackers['current'] = Order;
    };
    var _getAt = function(){
      return $localStorage.Trackers['current'];
    }
    var _getCustom = function(key){
      return $localStorage.customStore[key];
    }
    var _putCustom = function(key,value){
      $localStorage.customStore[key] = value;
    }
    var _remove = function(Order) {
        $localStorage.Orders.splice($localStorage.things.indexOf(Order), 1);
    };
    var _removeAll = function() {
        $localStorage.Orders = [];
    };

    return {
        getAll: _getAll,
        getCustom:_getCustom,
        putCustom:_putCustom,
        add: _add,
        addAt:_addAt,
        getAt:_getAt,
        remove: _remove,
        removeAll: _removeAll
    };
});
