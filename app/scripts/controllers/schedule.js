'use strict';

/**
 * @ngdoc function
 * @name courseWizUiApp.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the courseWizUiApp
 */
angular.module('courseWizUiApp')
  .controller('ScheduleCtrl', function ($scope, $resource, $window) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    // Events vars
    $scope.eventSources = [];
    $scope.events = [];
    $scope.classes = [];
    
    // changes semester
    $scope.goToSemester = function(semester) {
    
      $scope.updateEvents($scope.eventSources,$scope.classes,semester);
      
      var date = null;
      if (semester === 'Fall 2014') {
	date = new Date(2014,7,25,0,0,0);
	$scope.myCalendar.fullCalendar('gotoDate',date);
	//$scope.updateEvents($scope.eventSources,$scope.classes);
      }
      else if (semester === 'Spring 2015') {
	date = new Date(2015,0,26,0,0,0);
	$scope.myCalendar.fullCalendar('gotoDate',date);
	//$scope.updateEvents($scope.eventSources,$scope.classes);
      }
      
    };
    
    // replaces events in the calendar
    $scope.updateEvents = function(sources,source,semester) {
      
      if (semester) {
	
	// get classes from back-end
	var Schedule = $resource('http://127.0.0.1:8000/api/courses',{'query':  {method:'GET', isArray:true}});
	
	var schedule = Schedule.query(function() {
	  

	  for(var i = 0; i < schedule.length; i++)
	    {
	      switch(schedule[i].day) {
	      
		case 'M': {
		  if (schedule[i].semester === 'FA14') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2014-08-25T'+schedule[i].start, end: '2014-08-25T'+schedule[i].end};
		  }
		  else if(schedule[i].semester === 'SP15') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2015-01-26T'+schedule[i].start, end: '2015-01-26T'+schedule[i].end};
		  }
		  break;
		}
		case 'T': {
		  if (schedule[i].semester === 'FA14') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2014-08-26T'+schedule[i].start, end: '2014-08-26T'+schedule[i].end};
		  }
		  else if(schedule[i].semester === 'SP15') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2015-01-27T'+schedule[i].start, end: '2015-01-27T'+schedule[i].end};
		  }
		  break;
		}
		case 'W': {
		  if (schedule[i].semester === 'FA14') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2014-08-27T'+schedule[i].start, end: '2014-08-27T'+schedule[i].end};
		  }
		  else if(schedule[i].semester === 'SP15') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2015-01-28T'+schedule[i].start, end: '2015-01-28T'+schedule[i].end};
		  }
		  break;
		}
		case 'R': {
		  if (schedule[i].semester === 'FA14') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2014-08-28T'+schedule[i].start, end: '2014-08-28T'+schedule[i].end};
		  }
		  else if(schedule[i].semester === 'SP15') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2015-01-29T'+schedule[i].start, end: '2015-01-29T'+schedule[i].end};
		  }
		  break;
		}
		case 'F': {
		  if (schedule[i].semester === 'FA14') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2014-08-29T'+schedule[i].start, end: '2014-08-29T'+schedule[i].end};
		  }
		  else if(schedule[i].semester === 'SP15') {
		    $scope.classes[i] = {title: schedule[i].title, start: '2015-01-30T'+schedule[i].start, end: '2015-01-30T'+schedule[i].end};
		  }
		  break;
		}
	      }
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
	  

	  var date = null;
	  if (semester === 'Fall 2014') {
	    date = new Date(2014,7,25,0,0,0);
	    $scope.myCalendar.fullCalendar('gotoDate',date);
	    //$scope.updateEvents($scope.eventSources,$scope.classes);
	  }
	  else if (semester === 'Spring 2015') {
	    date = new Date(2015,0,26,0,0,0);
	    $scope.myCalendar.fullCalendar('gotoDate',date);
	    //$scope.updateEvents($scope.eventSources,$scope.classes);
	  }
	  
	  //var date = new Date(2014,7,25,0,0,0);
	  
	  //$scope.myCalendar.fullCalendar('gotoDate',date);
	  
	});
      }
      else {
	$window.alert('Please select semester!');
      }
      
    };
    
    
    // Calendar config object 
    $scope.uiConfig = {
      calendar:{
	defaultView: 'agendaWeek',
	height: 675,
	minTime: '08:00:00',
	editable: false,
	header:{
	  left: 'month agendaWeek',
	  center: 'title'
	  //right: 'today prev,next'
	}
      }
    };
    
  });
  