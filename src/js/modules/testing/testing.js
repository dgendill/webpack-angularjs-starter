import angular from 'angular';

export default angular.module('appTesting', [])
.controller('MyController', ['$scope', function($scope) {
  $scope.data = {
    name : "hello"
  };  
}]);