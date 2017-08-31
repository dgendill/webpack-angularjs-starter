import angular from 'angular';
import 'Modules/auth';

export default angular
  .module('appRoutes', ['ui.router', 'appAuth'])
  .config(["$stateProvider", "AuthProvider", function($stateProvider, AuthProvider) {

    AuthProvider.setBaseUrl('http://localhost:3001');

    
    $stateProvider.state({
      name: 'root',
      url: '',
      template: '<ui-view></ui-view>',
      resolve: {
        session : function(Auth, $state) {
          return Auth
            .checkAndCacheSession()
            .then(function(session) {
              console.log('User session is ok.');
              $state.go('root.home');
              return session;
            }, function(err) {
              console.log("User does not have a session. " + err.message);
              $state.go('root.login');
            });
        }
      }
    });

    $stateProvider.state({
      name: 'root.home',
      url: '/home',
      template: 'Home'
    });

    $stateProvider.state({
      name: 'root.login',
      url: '/login',
      template: "<login-form></login-form>"
    });

  }])
  .run(["$rootScope", "Auth", "$transitions", function($rootScope, Auth, $transitions) {
    console.log('running');

    $transitions.onBefore({to:'root.login'}, function (transition) {
      console.log(transition);
      if (Auth.session) {
        // return false;
        return transition.router.stateService.target("root.home");
      } else {
        return true;
      }
      // do stuff on every transition such as change page title [global scope here]
    });

    
   


  }]);
