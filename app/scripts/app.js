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
  .config(function ($routeProvider,$resourceProvider,$httpProvider) {
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
      $httpProvider.defaults.withCredentials = true;
      $resourceProvider.defaults.stripTrailingSlashes = false;
  })
  
  /*
  .config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
    
  }])
  */
    
  .controller('ApplicationController', function ($scope) {
    
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
    
    // Login vars
    $scope.currentUser = null;
    //$rootScope.currentUser = null;
    $scope.isLoginPage = false;
    //$scope.isAuthorized = AuthService.isAuthorized;
  
    //Student info
    $scope.studentRin = null;
    $scope.studentName = null;
    $scope.studentMajor = null;
    $scope.studentCourses = null;
    $scope.sessionId = null;
    
    // Studet info setters
    $scope.setStudentRin = function (rin) {
      $scope.studentRin = rin;
    };
    
    $scope.setStudentName = function (name) {
      $scope.studentName = name;
    };
    
    $scope.setStudentMajor = function (major) {
      $scope.studentMajor = major;
    };
    
    $scope.setStudentCourses = function (courses) {
      $scope.studentCourses = courses;
    };
    
    // Current user setter
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
    
    //logout
    $scope.logout = function() {
    
      $scope.setCurrentUser(null);
    };
  
  });
  
  /*
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
  */