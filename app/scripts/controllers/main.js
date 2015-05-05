'use strict';

/**
 * @ngdoc function
 * @name courseWizUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the courseWizUiApp
 */
angular.module('courseWizUiApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];



  })


  // Login Controller
  .controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $resource) {

    //Student info
    $scope.studentRin = null;
    $scope.studentName = null;
    $scope.studentMajor = null;
    $scope.sessionId = null;

    $scope.credentials = {
      username: '',
      password: ''
    };


    //Login
    $scope.login = function (credentials) {

      AuthService.login(credentials).then(function (user) {

	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	$scope.setCurrentUser(user);

	var Student = $resource('http://127.0.0.1:8000/api/student');

	var student = Student.get(function() {

	  $scope.studentRin = student.rin;
	  $scope.studentMajor = student.degree;
	  $scope.studentName = student.name;
      $scope.required = student.required;
      $scope.taken = student.courses;

	});

      }, function () {

	$rootScope.$broadcast(AUTH_EVENTS.loginFailed);

      });
    };

    $scope.scores = {};

    $scope.calculateCredits = function() {
        var credits = 0;
        for(var i in $scope.taken) {
            credits += $scope.taken[i].credit_hours;
        }
        return credits;
    }

    $scope.calculateGPA = function() {
        var credits = 0;
        var points = 0;
        for(var i in $scope.taken) {
            credits += $scope.taken[i].credit_hours;
            points += $scope.taken[i].points;
        }
        return points/credits;
    }

    $scope.requirementSatisified = function(requirement) {
        for(var i in $scope.taken) {
            if(requirement.options.indexOf($scope.taken[i].crn) > -1) {
                $scope.scores[requirement] = $scope.taken[i];
                return true;
            }
        }
        return false;
    }

  })

  // Authentication Service
  .factory('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {

      /*
      return $resource('http://127.0.0.1:8000/api/login/', {username: credentials.username, password: credentials.password}, {doLogin: {method: 'POST'}})
	.doLogin()
	.then(function() {
	  Session.create(credentials.username);
	  return credentials.username;
	});
      */


      return $http
	.post('http://127.0.0.1:8000/api/login/', credentials)
	.then(function (res) {
	  console.log(res);
	  Session.create(credentials.username);
	  return credentials.username;
	});

    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    return authService;
  })

  // Session tracker
  .service('Session', function () {
    this.create = function (sessionId, userId) {
      //this.id = sessionId;
      this.userId = userId;
      //this.userRole = userRole;
    };
    this.destroy = function () {
      //this.id = null;
      this.userId = null;
      //this.userRole = null;
    };
  })

/*
  // Interceptor
  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
	return $injector.get('AuthInterceptor');
      }
    ]);
  })
*/

  // Getting auth event
  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
	$rootScope.$broadcast({
	  401: AUTH_EVENTS.notAuthenticated,
	  403: AUTH_EVENTS.notAuthorized,
	  419: AUTH_EVENTS.sessionTimeout,
	  440: AUTH_EVENTS.sessionTimeout
	}[response.status], response);
	return $q.reject(response);
      }
    };
  })

  // Re-login dialog
  .directive('loginDialog', function (AUTH_EVENTS) {
    return {
      restrict: 'A',
      template: '<div ng-if="visible" ng-include="\'login-form.html\'">',
      link: function (scope) {
	var showDialog = function () {
	  scope.visible = true;
	};

	scope.visible = false;
	scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
	scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
      }
    };
  })

  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  });
