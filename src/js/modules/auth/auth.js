import angular from 'angular';
import 'angular-cookies';
import UserSession from 'Models/UserSession';
import AuthError from 'Models/AuthError';

const COOKIE_KEY = "Auth";

let m = angular.module('appAuth', ['ngCookies'])

m.provider('Auth', [function() {
  var baseUrl = window.location.origin;
  const that = this;

  const sessionResource = function() {
    return baseUrl + "/session";
  }

  this.setBaseUrl = function(url) {
    baseUrl = url;
  }

  let deps = ["$timeout", "$cookies", "$http"]
  function Auth($timeout, $cookies, $http) {

    var that = this;
    // String -> String -> Promise AuthError UserSession
    this.login = function(username, password) {
      return new Promise(function(success, fail) {
        if (password.trim() == "") {
          fail({
            data : AuthError.NoPassword
          })
        } else {
          $http({
            method:"POST",
            url: sessionResource(),
            data: {
              username : username,
              password : password
            }
          }).then(function(response) {
            $cookies.put(COOKIE_KEY, response.data.response.token);
            success(UserSession(response.data.response));
          }, fail);   
        }        
      });
    }

    // Promise AuthError UserSession
    this.checkAndCacheSession = function() {
      return new Promise(function(success, fail) {
        if (that.session) {
          success(that.session);
        } else {
          that.checkSession()
          .then(function(session) {
            that.session = session;
            success(that.session);
          }, fail);
        }
      });  
    }

    // Promise AuthError UserSession
    this.checkSession = function() {
      return new Promise(function(success, fail) {
        let token = $cookies.get(COOKIE_KEY);
        if (token) {
          $http({
            url : sessionResource(),
            method: 'POST',
            data: {
              token : token
            }
          }).then(function(response) {
            success(UserSession(response.data)); 
          }, fail)
        } else {
          fail(AuthError.NoCookie);
        }        
      });
    }

  }

  this.$get = function($injector) {
    return $injector.instantiate(Auth, deps);
  }

}])

m.config(function(AuthProvider) {
  AuthProvider.setBaseUrl('');
})

import loginForm from './components/loginForm';
loginForm(m);

export default m;
  
  