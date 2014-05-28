'use strict';

/* Services */

var genServices = angular.module('genServices', ['ngResource']);


genServices.factory('Record1', ['$resource','$http',
                               function($resource,$http){

                               var o= $resource('../consumptions',{},{
                               query:{method:'GET',params:{},isArray:true}});
                               return(o);
                                 }
                               ]);

genServices.factory('Record2', ['$resource','$http',
                               function($resource,$http){

                               return $resource('../generations',{},{
                               query1:{method:'GET',params:{},isArray:true}});
                                
                                 }
                               ]);
genServices.factory('Record3', ['$resource','$http',
                                function($resource,$http){

                                return $resource('../consumptions',{},{
                                getState:{method:'GET',params:{},isArray:true}});
                                 
                                  }
                                ]);

