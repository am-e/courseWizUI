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
      'Karma',
      'ui.calendar'
    ];
    
    // Login vars
    $scope.currentUser = null;
    //$scope.userRoles = USER_ROLES;
    //$scope.isAuthorized = AuthService.isAuthorized;
    $scope.isLoginPage = false;
    $scope.eventSources = [];
    
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
    
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    
  })
  
  // Login Controller
  .controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    
    $scope.credentials = {
      username: '',
      password: ''
    };
    
    $scope.login = function (credentials) {
      
      AuthService.login(credentials).then(function (user) {
	
	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	$scope.setCurrentUser(user);
	//console.log($scope.currentUser.id);
	
      }, function () {
	
	$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	
      });
    };
  })
  
  // Authentication Service
  .factory('AuthService', function ($http, Session) {
    var authService = {};
  
    authService.login = function (credentials) {
      
      return $http
	.post('http://localhost:3000/login', credentials)
	.then(function (res) {
	  //console.log(res.data.id+' '+res.data.user.username);
	  Session.create(res.data.id, res.data.user.username);
	  return res.data.user;
	});
    
    };
  
    authService.isAuthenticated = function () {
      return !!Session.userId;
    };
  
/*
    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
	authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
	authorizedRoles.indexOf(Session.userRole) !== -1);
    };
*/ 
    return authService;
  })


  // Session tracker
  .service('Session', function () {
    this.create = function (sessionId, userId) {
      this.id = sessionId;
      this.userId = userId;
      //this.userRole = userRole;
    };
    this.destroy = function () {
      this.id = null;
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

  