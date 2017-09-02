import angular from 'angular';
import L from '../auth.js';

let deps = ["Auth", "$state"];
let dir = function(Auth, $state) {
  return {
    restrict : 'A',
    scope : {},
    link : function($scope, element, attrs) {
      element.addClass('u-pointer');
      element.on('click', function() {
        Auth.logout();
        $state.go('root.login');
      })
      
    }
  }
}

L.directive('appLogoutButton', deps.concat([dir]));