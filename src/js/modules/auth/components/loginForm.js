import angular from 'angular';
import FormStateMachine from 'Models/FormStateMachine';
import Rx from 'rxjs/Rx';

export default function(m) {
  let template = require('./loginForm.html');
  return m.component('loginForm', {
    template : template,
    controller : function($scope, Auth, $state) {
      var that = this;
      this.username = "";
      this.password = "";

      this.state = FormStateMachine();

      // var source = Rx.BehaviorSubject(this.state);
      // source.subscribe(function(x) {
      //   console.log('Next: %s', x);
      // });

      this.login = function() {
        this.state.enterLoading('Logging In...');

        Auth
          .login(this.username, this.password)
          .then(function(session) {
            that.state.enterSuccess('Successfully Logged In').hide();
            $state.go('root.home');
          }, function(err) {
            console.log(err);
            that.state.enterFailure(err.data.message);
            $scope.$apply();
          });        
      }

      this.inputDisabled = function() {
        return this.state.isLoading();
      }

      this.submitDisabled = function() {
        return this.state.isLoading() ||
               !$scope.loginform.$valid;
      }

      this.formClasses = function() {
        return {
          'loginform--pending-login' : this.state.isLoading()
        }
      }
    }
  });
}
