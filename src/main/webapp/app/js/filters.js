'use strict';
var genfilter=angular.module('genFilters', []);
genfilter.filter('yearfilter', function() {

	return function(arr){
		
		var result=[];
		
		angular.forEach(arr,function(item)
	{        
			if(item.state_name=="PUNJAB")
			{item.nuclear=item.nuclear+item.nuclear;
			item.hydro=item.hydro+item.hydro;
		    item.thermal=item.thermal+item.thermal;
			}
			
		    
	});
		
return result;
	};
});




