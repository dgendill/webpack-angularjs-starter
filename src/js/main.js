import angular from 'angular';
import './modules/testing';

window.addEventListener('load', function() {
  angular.element(function() {
    angular.bootstrap(document.getElementById('myApp'), [
      "testing"
    ])
  })
})
