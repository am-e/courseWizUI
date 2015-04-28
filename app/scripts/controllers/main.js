'use strict';

/**
 * @ngdoc function
 * @name courseWizUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the courseWizUiApp
 */
angular.module('courseWizUiApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    // Login vars
    $scope.currentUser = null;
    //$rootScope.currentUser = null;
    $scope.isLoginPage = false;
    
    // Events vars
    $scope.eventSources = [];
    $scope.events = [];
    $scope.classes = [];
    
    
    // Current user setter
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
      
    };
    
    /*
    // Current user setter
    $rootScope.setCurrentUser = function (user) {
      $rootScope.currentUser = user;
      
    };
    */
    
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      
      // Get events from json (then back-end)
      //$http.get('classes.json').success(function(data) {
      $http.post('http://localhost:3000/getclasses', {username:$scope.currentUser.username, major:$scope.major}).success(function(data) {
	for(var i = 0; i < data.length; i++)
	  {
	    
	    $scope.classes[i] = {title: data[i].title, start: data[i].start, end: data[i].end};
	    
	  }
	
	var canAdd = 0;
	angular.forEach(sources,function(value, key){
	  if(sources[key] === source){
	    sources.splice(key,1);
	    canAdd = 1;
	  }
	});
	
	if(canAdd === 0){
	  sources.push(source);
	}
	
	var date = new Date(2014,7,25,0,0,0);
	
	//console.log(uiCalendarConfig['myCalendar']);
	$scope.myCalendar.fullCalendar('gotoDate',date);
	$scope.myCalendar.fullCalendar('defaultView','agendaDay');
	
      });
      
    };
    
    /*
    // add custom event
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    
    
    // remove event
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    */
    
    /*
    // Handle request schedule
    $scope.requestSchedule = function() {
      
      
      var events = [
	    {
		title  : 'event1',
		start  : '2015-04-22',
		end    : '2015-04-22'
	    },
	    {
		title  : 'event2',
		start  : '2015-04-23',
		end    : '2015-04-23'
	    },
	    {
		title  : 'event3',
		start  : '2015-04-24',
		end    : '2015-04-24'
	    }
	];
	
	for(var i = 0; i < events.length; ++i) {
	  $scope.events.push(events[i]);
	}
	
	
	$scope.eventSources = [$scope.events];
	
	//$scope.myCalendar.fullCalendar('refetchEvents');
	//$scope.myCalendar.fullCalendar('render');
	
	//console.log($scope.myCalendar[0]);
	
    };
    */
    
    /*
    // Get events from json (then back-end)
    $http.get('classes.json').success(function(data) {
      for(var i = 0; i < data.length; i++)
	{
	  
	  $scope.classes[i] = {title: data[i].title, start: data[i].start, end: data[i].end};
	  
	}
      
      
    });
    */
    
     
    /*
    // Sample events
    $scope.events = [
	    {
		title  : 'event1',
		start  : '2015-04-22',
		end    : '2015-04-22'
	    },
	    {
		title  : 'event2',
		start  : '2015-04-23',
		end    : '2015-04-23'
	    },
	    {
		title  : 'event3',
		start  : '2015-04-24',
		start  : '2015-04-24'
	    }
	];
    */
    
    // Calendar config object 
    $scope.uiConfig = {
      calendar:{
	defaultView: 'agendaWeek',
	height: 675,
	minTime: '08:00:00',
	editable: false,
	header:{
	  //left: 'month basicWeek basicDay agendaWeek agendaDay',
	  //center: 'title'
	  //right: 'today prev,next'
	}
      }
    };
    
    // Set events source
    //$scope.eventSources = [$scope.events];
    
    
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
	//$rootScope.setCurrentUser(user);
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

  