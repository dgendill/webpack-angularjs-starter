import angular from 'angular';

angular.module('testing', [])
.controller('MyController', ['$scope', function($scope) {
  $scope.data = {
    name : "hello"
  };  
}]);