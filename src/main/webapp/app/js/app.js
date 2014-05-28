'use strict';

/* App Module */

var genApp = angular.module('genApp', ['ngSlider',
  'ngRoute',
  'genControllers',
  'genServices',
  'ui.bootstrap',
  
]);

genApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
   
      when('/Statatics', {
        templateUrl: './record.html',
        controller: 'RecordCtrl'
      }).
      when('/state', {
          templateUrl: './state.html',
          controller: 'stateCtrl'
        }).
        when('/surplusState', {
            templateUrl: './Thermal.html',
            controller: 'surplusCtrl'
          }).
          when('/deficitState', {
              templateUrl: './Thermal.html',
              controller: 'deficitCtrl'
            }).
      when('/barChart', {
          templateUrl: './Thermal.html',
          controller: 'consumptionGenerationCtrl'
        }).
      when('/thermalConsumption',{
        	templateUrl:'./Thermal.html',
        	controller:'thermalConsumptionCtrl'
          }).
      when('/consumptionChart',{
          	templateUrl:'./Thermal.html',
          	controller:'consumptionChartCtrl'
            }).
      when('/hydroConsumption',{
             templateUrl:'./Thermal.html',
             controller:'hydroConsumptionCtrl'
                }).
      when('/nuclearConsumption',{
              templateUrl:'./Thermal.html',
              controller:'nuclearConsumptionCtrl'
                    }).
      when('/thermalGeneration',{
               templateUrl:'./Thermal.html',
               controller:'thermalGenerationCtrl'
                              }).
       when('/hydroGeneration',{
               templateUrl:'./Thermal.html',
               controller:'hydroGenerationCtrl'
                                        }).
         when('/nuclearGeneration',{
                  templateUrl:'./Thermal.html',
                   controller:'nuclearGenerationCtrl'
                                                  }).
      when('/generationChart',{
      	templateUrl:'./Thermal.html',
      	controller:'genChartCtrl'
        })
    .when('/lineChart',{
      	templateUrl:'./linechart.html',
      	controller:'lineCtrl'
        })
     .when('/slider',{
      	templateUrl:'./Thermal.html',
      	controller:'generationCtrl'
        })
        .when('/home',{
      	templateUrl:'./Welcome.html',
      	
        })
        .otherwise({redirectTo:'/home'});
     
  }]);
