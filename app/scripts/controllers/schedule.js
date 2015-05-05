'use strict';

/**
 * @ngdoc function
 * @name courseWizUiApp.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the courseWizUiApp
 */
angular.module('courseWizUiApp')
  .controller('ScheduleCtrl', function ($scope, $resource) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    // Events vars
    $scope.eventSources = [];
    $scope.events = [];
    $scope.classes = [];
    $scope.semesters = {};
    $scope.loading = true;

    $scope.goToDate = function(date) {
        console.log(date);
	    $scope.myCalendar.fullCalendar('gotoDate',date);
    }


    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {

      /*
      // Get events from json (then back-end)
      $http.get('http://127.0.0.1:8000/api/courses').success(function(schedule) {
	for(var i = 0; i < schedule.length; i++)
	  {

	    switch(schedule[i].day) {

	      case 'M': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-25T'+schedule[i].start, end: time_string+'-25T'+schedule[i].end};
		break;
	      }
	      case 'T': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-26T'+schedule[i].start, end: time_string+'-26T'+schedule[i].end};
		break;
	      }
	      case 'W': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-27T'+schedule[i].start, end: time_string+'-27T'+schedule[i].end};
		break;
	      }
	      case 'R': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-28T'+schedule[i].start, end: time_string+'-28T'+schedule[i].end};
		break;
	      }
	      case 'F': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-29T'+schedule[i].start, end: time_string+'-29T'+schedule[i].end};
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

	var date = new Date(2014,7,25,0,0,0);

	//console.log(uiCalendarConfig['myCalendar']);
	$scope.myCalendar.fullCalendar('gotoDate',date);
	$scope.myCalendar.fullCalendar('defaultView','agendaDay');

      });

      */

      var Schedule = $resource('http://127.0.0.1:8000/api/courses',{'query':  {method:'GET', isArray:true}});

      var schedule = Schedule.query(function() {


	for(var i = 0; i < schedule.length; i++)
	  {
        var semester = schedule[i].semester.substring(0, 2);
        var year = schedule[i].semester.substring(2);

        var time_string = "20" + year + "-" + (semester == "FA" ? "08" : "12");

        if(!(schedule[i].semester in $scope.semesters)) {
            $scope.semesters[schedule[i].semester] = new Date(2000+parseInt(year),semester == "FA" ? 7 : 11, 25, 0, 0, 0);
        }


	    switch(schedule[i].day) {

	      case 'M': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-25T'+schedule[i].start, end: time_string+'-25T'+schedule[i].end};
		break;
	      }
	      case 'T': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-26T'+schedule[i].start, end: time_string+'-26T'+schedule[i].end};
		break;
	      }
	      case 'W': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-27T'+schedule[i].start, end: time_string+'-27T'+schedule[i].end};
		break;
	      }
	      case 'R': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-28T'+schedule[i].start, end: time_string+'-28T'+schedule[i].end};
		break;
	      }
	      case 'F': {
		$scope.classes[i] = {title: schedule[i].title, start: time_string+'-29T'+schedule[i].start, end: time_string+'-29T'+schedule[i].end};
		break;
	      }
	    }
        $scope.loading = false;
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

    // Kick things off onload
    $scope.addRemoveEventSource($scope.eventSources,$scope.classes);

  });
