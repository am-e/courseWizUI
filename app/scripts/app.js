'use strict';

/**
 * @ngdoc overview
 * @name courseWizUiApp
 * @description
 * # courseWizUiApp
 *
 * Main module of the application.
 */
angular
  .module('courseWizUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.calendar',
    'ngResource'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/schedule', {
        templateUrl: 'views/schedule.html',
        controller: 'ScheduleCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  
  .controller('ApplicationController', function ($scope,AuthService) {
    
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
    
    // Login vars
    $scope.currentUser = null;
    //$rootScope.currentUser = null;
    $scope.isLoginPage = false;
    $scope.isAuthorized = AuthService.isAuthorized;
  
    
    // Current user setter
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
  
  })
  
  .run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
	event.preventDefault();
	if (AuthService.isAuthenticated()) {
	  // user is not allowed
	  $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
	} else {
	  // user is not logged in
	  $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
	}
      }
    });
  });