import angular from 'angular';
import L from '../layout.js';
import sidebar from 'sidebar.html'

L.directive('app-sidebar', function() {
  return {
    template : sidebar,
    restrict : 'E',
    scope : {},
    link : function($scope, element, attrs) {
      $scope.data.menuItems = [
        "Home",
        "Browse",
        "My Recipes"
      ]
    }
    


  }
})