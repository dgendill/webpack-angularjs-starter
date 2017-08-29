import angular from 'angular';
import 'angular-cookies';
import UserSession from 'Models/UserSession';
import AuthError from 'Models/AuthError';

const COOKIE_KEY = "Auth";

let m = angular.module('appAuth', ['ngCookies'])

m.provider('Auth', [function() {
  var baseUrl = "";

  this.setBaseUrl = function(url) {
    baseUrl = url;
  }

  function Auth($timeout, $cookies) {

    // String -> String -> Promise AuthError UserSession
    this.login = function(username, password) {
      return new Promise(function(success, fail) {
        if (password.trim() == "") {
          fail(AuthError.NoPassword)
        } else {
          $timeout(function() {
            var session = UserSession.createMock();
            $cookies.put(COOKIE_KEY, session.token);
            success(session);
          }, 2000);
        }        
      });
    }

    this.checkAndCacheSession = function() {
      var that = this;
      return new Promise(function(success, fail) {
        if (that.session) {
          success(that.session);
        } else {
          that.checkSession().then(function(session) {
            that.session = session;
            success(that.session);
          });
        }
      });  
    }

    // Promise AuthError UserSession
    this.checkSession = function() {
      return new Promise(function(success, fail) {
        let token = $cookies.get(COOKIE_KEY);
        if (token) {
          $timeout(function() {
            success(UserSession.createMock()); 
          }, 2000);
        } else {
          fail(AuthError.NoCookie);
        }        
      });
    }

  }

  this.$get = function($injector) {
    return $injector.instantiate(Auth, ["$timeout", "$cookies"]);
  }

}])

m.config(function(AuthProvider) {
  AuthProvider.setBaseUrl('');
})

import loginForm from './components/loginForm';
loginForm(m);

export default m;
  
  