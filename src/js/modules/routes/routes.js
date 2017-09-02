import angular from 'angular';
import 'Modules/auth';

export default angular
  .module('appRoutes', ['ui.router', 'appAuth'])
  .config(["$stateProvider", "AuthProvider", "$httpProvider", "$provide", function($stateProvider, AuthProvider, $httpProvider, $provide) {

    AuthProvider.setBaseUrl('http://localhost:3001');

    // register the interceptor as a service
    $provide.factory('httpErrorInterceptor', function($q) {
      return {
        // optional method
      'responseError': function(rejection) {
          if (rejection.status == -1 || rejection.data == null) {
            rejection.data = {
              message : "Oops, something unexpected went wrong.",
              debug : rejection.config
            }
          }
          console.log(rejection);
          return $q.reject(rejection);
        }
      };
    });

    $httpProvider.interceptors.push('httpErrorInterceptor');
    
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
      template: require('Templates/home.html')
    });

    $stateProvider.state({
      name: 'root.login',
      url: '/login',
      template: require('Templates/login.html')
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
