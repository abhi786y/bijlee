'use strict';

/* Controllers */

var genControllers = angular.module('genControllers',[]);

genControllers.controller('RecordCtrl', [ '$scope','Record1','Record2','$location',
		'$http',function($scope,Record1,Record2,$location,$http) {

		
			$scope.cons=Record1.query();
			$scope.genss=Record2.query1();
} ]);

genControllers.controller('surplusCtrl', [ '$scope','Record1','$location',
                                                  		'$http',function($scope,Record1,$location,$http) {
                             
var maxYear=null;
var minYear=null;


var c=0;
var margin = {top: 30, right: 10, bottom: 150, left: 50},
width = 1000 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// Parse the date / time
var h= document.createElement('h3');
h.innerHTML='Surplus states Chart';
document.getElementById("header").appendChild(h);


$http.get("../consumptions").then(function(response){var data3=response.data;
maxYear=d3.max(data3,function(d){return d.consYear;});
minYear=d3.min(data3,function(d){return d.consYear;});
$scope.value = "2013";
$scope.options = {       
  from: minYear,
  to: maxYear,
  step: 1,
  dimension: " Year",
  
};
buildChart();
});



 

$scope.sliderChange=function()
 {
	document.getElementById("thermal_check").checked=false;
	buildChart();
 };

      function buildChart()
      { //var sortData=null;
    	  if(c!=0)
 		 {
     	 document.getElementById("thermal").innerHTML="";
 	     document.getElementById("legend").innerHTML="";
 		 }
    	  c++;
       var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);

       var y = d3.scale.linear().range([height, 0]);
       
       var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom")
           .tickSize(20);

       var yAxis = d3.svg.axis()
           .scale(y)
           .orient("left")
           .ticks(25);
       
       var svg = d3.select("#thermal").append("svg")
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .attr("id","chart")
          
           
         .append("g")
           .attr("transform", 
                 "translate(" + margin.left + "," + margin.top + ")");
      
       var w=$("#chart").parent().width()+500;
       var aspect = w / 600,
       chart = $("#chart");
       
       chart.attr("width",w)
        .attr("viewBox","0 0 "+w+" 600");
   $(window).on("resize", function() {
       var targetWidth = chart.parent().width()+500;
       chart.attr("width", targetWidth);
       chart.attr("height", targetWidth / aspect)
        .select("g")
           .attr("transform", 
                 "translate(" + margin.left + "," + margin.top + ")");
   });
                            
       var div = d3.select("#thermal").append("div")   
       .attr("class", "tooltip")               
       .style("opacity", 0);
       var dataConsuption=null;
       var maxYValue=null;
       
       d3.json("../consumptions?find=ByConsYear&consYear="+$scope.value, function(error, data1) {				// Go to the data folder (in the current directory) and read in the data.tsv file
    		data1.forEach(function(d) {								// For all the data values carry out the following
    			d.stateName=d.stateName;
    			d.thermal=+d.thermal;
    			d.nuclear=+d.nuclear;
    			d.hydro=+d.hydro;// makesure d.data is a number, not a string
    		});
    		dataConsuption=data1;
    		 d3.json("../generations?find=ByGenYear&genYear="+$scope.value, function(error, data) {
    	    	   var k=0,m=1,obj=null;
    	           data.forEach(function(d) {
    	        	   
    	         for(;k<m;k++)
    	        	 {
    	        	 obj=dataConsuption[k];
    	        	 
    	        	 }
    	         m++;
    	               d.hydro=+d.hydro;
    	               d.nuclear=+d.nuclear;
    	               d.thermal = +d.thermal;
    	               d.hydro=d.hydro-obj.hydro;
    	               d.nuclear=d.nuclear-obj.nuclear;
    	               d.thermal=d.thermal-obj.thermal;
    	               
    	              });
    	           
    	        var barwidth=(width-50)/data.length;
    	        
    	        for(var i=0;i<data.length;i++)
    	        	{
    	        	var obj1=data[i];
    	        	if((obj1.thermal+obj1.nuclear+obj1.hydro)<0)
    	        		{data.splice(i, 1);
    	        	i--;}
    	        	}
    	         x.domain(data.map(function(d) { return d.stateName; }));
    	         y.domain([0,d3.max(data, function(d) { return d.thermal+d.hydro+d.nuclear; })]);

    	         svg.append("g")
    	             .attr("class", "x axis")
    	             .attr("transform", "translate(0," + height + ")")
    	             .call(xAxis)
    	           .selectAll("text")
    	             .style("text-anchor", "end")
    	             .style("font-size",15)
    	             .attr("dx", "-0.5em")
    	             .attr("dy", "-2em")
    	             .attr("transform", "rotate(-65)" );

    	         svg.append("g")
    	             .attr("class", "y axis")
    	             .call(yAxis)
    	           .append("text")
    	             .attr("transform", "rotate(-90)")
    	             .attr("y", 6)
    	             .attr("dy", ".71em")
    	             .style("text-anchor", "end");
    	             
    	         
    	         svg.selectAll("bar")
    	             .data(data)
    	           .enter().append("rect")
    	           .style("fill","steelblue")
    	           .attr("x", function(d) { return x(d.stateName); })
    	             .attr("width", barwidth-6)
    	             .attr("y", function(d) {return y(d.thermal+d.hydro+d.nuclear); })
    	             .attr("height", function(d) { return  height - y(d.thermal+d.nuclear+d.hydro); })
    	             .on('mouseover',function(d){
    	            	 var state=d.stateName;
    	            	
    	            	 if(state=="Andhra Pradesh")
    	            		 state="Andhra";
    	            	 if(state=="MADHYA PRADESH")
    	            		 state="M.P.";
    	            	 if(state=="UTTAR PRADESH")
    	            		 state="U.P.";
    	            	 if(state=="JAMMU AND KASHMIR")
    	            		 state="J&K";
    	            	 if(state=="ARUNACHAL PRADESH")
    	            		 state="Arunachal";
    	                d3.select(this)
    	                .transition()  // adds a "smoothing" animation to the transition
    	              .duration(200)
    	                 .attr("x", function(d) { return x(d.stateName)-6; })
    	             .attr("width", barwidth+6)
    	             .attr("y", function(d) {return y(d.thermal+d.hydro+d.nuclear)-10; })
    	             .attr("height", function(d) {return  height - y(d.thermal+d.nuclear+d.hydro)+10; })
    	               ;
    	               
    	                div.transition()        
    	                .duration(200)      
    	                .style("opacity", .9);
    	                
    	            div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Generation:</strong> <span style='color:steelblue;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) +"</span>")  
    	                .style("left", (d3.event.pageX-200) + "px")     
    	                .style("top", (d3.event.pageY-105) + "px");
    	               
    	              })
    	           .on('mouseout',function(d){
    	          	
    	              d3.select(this)
    	              .transition()  // adds a "smoothing" animation to the transition
    	              .duration(500)
    	               .attr("x", function(d) { return x(d.stateName)-1; })
    	             .attr("width", barwidth-6)
    	             .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
    	             .attr("height", function(d) {return height - y(d.thermal+d.nuclear+d.hydro); })
    	               
    	                 ;
    	              div.transition()        
    	              .duration(500)      
    	              .style("opacity", 0);
    	              });
    	         d3.select("input#thermal_check").on("change", change);
    	         
    	         var sortTimeout = setTimeout(function() {
    	           d3.select("input").on("change",change);
    	         },750);

    	         function change() {
    	           clearTimeout(sortTimeout);
    	         var x0 = x.domain(data.sort(this.checked
    	               ? function(a, b) {return (b.thermal+b.hydro+b.nuclear) - (a.thermal+a.hydro+a.nuclear);}
    	               : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
    	               .map(function(d) { return d.stateName; }))
    	               .copy();

    	           var transition = svg.transition().duration(750),
    	               delay = function(d, i) { return i * 50; };

    	           transition.selectAll("rect")
    	               .delay(delay)
    	               .attr("x", function(d) { return x0(d.stateName); });

    	           transition.select(".x.axis")
    	               .call(xAxis)
    	           .selectAll("text")
    	             .style("text-anchor", "end")
    	             .style("font-size",15)
    	             .attr("dx", "-0.5em")
    	             .attr("dy", "-2em")
    	             .attr("transform", "rotate(-65)" )
    	             .selectAll("g")
    	             .delay(delay);
    	         }
    	         $("#thermal").hide(0).delay(500).fadeIn(3000);
    	       });
    	
    	});

      
      }
      } ]);

genControllers.controller('deficitCtrl', [ '$scope','Record1','$location',
                                     		'$http',function($scope,Record1,$location,$http) {
                
var maxYear=null;
var minYear=null;

var c=0;
var margin = {top: 30, right: 10, bottom: 150, left: 50},
width = 700 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// Parse the date / time
var h= document.createElement('h3');
h.innerHTML='Deficit states Chart';
document.getElementById("header").appendChild(h);
$http.get("../consumptions").then(function(response){var data3=response.data;
maxYear=d3.max(data3,function(d){return d.consYear;});
minYear=d3.min(data3,function(d){return d.consYear;});
$scope.value = "2013";
$scope.options = {       
  from: minYear,
  to: maxYear,
  step: 1,
  dimension: " Year",
  
};
buildChart();
});


$scope.sliderChange=function()
{document.getElementById("thermal_check").checked=false;
buildChart();
};


function buildChart()
{ //var sortData=null;
if(c!=0)
{
document.getElementById("thermal").innerHTML="";
document.getElementById("legend").innerHTML="";
}
c++;
var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.tickSize(20);

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(25);

var svg = d3.select("#thermal").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
    "translate(" + margin.left + "," + margin.top + ")");



               
var div = d3.select("#thermal").append("div")   
.attr("class", "tooltip")               
.style("opacity", 0);
var dataConsuption=null;
var maxYValue=null;

d3.json("../consumptions?find=ByConsYear&consYear="+$scope.value, function(error, data1) {				// Go to the data folder (in the current directory) and read in the data.tsv file
data1.forEach(function(d) {								// For all the data values carry out the following
	d.stateName=d.stateName;
	d.thermal=+d.thermal;
	d.nuclear=+d.nuclear;
	d.hydro=+d.hydro;// makesure d.data is a number, not a string
});
dataConsuption=data1;
d3.json("../generations?find=ByGenYear&genYear="+$scope.value, function(error, data) {
	var k=0,m=1,obj=null;
	data.forEach(function(d) {
	  
	for(;k<m;k++)
	{
	obj=dataConsuption[k];

	}
	m++;
	  d.hydro=+d.hydro;
	  d.nuclear=+d.nuclear;
	  d.thermal = +d.thermal;
	  d.hydro=d.hydro-obj.hydro;
	  d.nuclear=d.nuclear-obj.nuclear;
	  d.thermal=d.thermal-obj.thermal;
	  
	 });

	var barwidth=(width+200)/data.length;

	for(var i=0;i<data.length;i++)
	{
	var obj1=data[i];
	if((obj1.thermal+obj1.nuclear+obj1.hydro)>0)
		{data.splice(i, 1);
	i--;}
	}
	x.domain(data.map(function(d) { return d.stateName; }));
	y.domain([0,d3.max(data, function(d) { return -(d.thermal+d.hydro+d.nuclear); })]);

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.selectAll("text")
	.style("text-anchor", "end")
    .style("font-weight", "bold")
	.attr("dx", "-0.5em")
	.attr("dy", "-2em")
	.attr("transform", "rotate(-65)" );

	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end");


	svg.selectAll("bar")
	.data(data)
	.enter().append("rect")
	.style("fill","#990400")
	.attr("x", function(d) { return x(d.stateName)+2; })
	.attr("y", function(d) {return y(-(d.thermal+d.hydro+d.nuclear)); })
	.attr("width", barwidth-6)
	.attr("height", function(d) { return  height - y(-(d.thermal+d.nuclear+d.hydro)); })
	.on('mouseover',function(d){
		 var state=d.stateName;
		
		 if(state=="Andhra Pradesh")
			 state="Andhra";
		 if(state=="MADHYA PRADESH")
			 state="M.P.";
		 if(state=="UTTAR PRADESH")
			 state="U.P.";
		 if(state=="JAMMU AND KASHMIR")
			 state="J&K";
		 if(state=="ARUNACHAL PRADESH")
			 state="Arunachal";
	   d3.select(this)
	   .transition()  // adds a "smoothing" animation to the transition
	 .duration(200)
	    .attr("x", function(d) { return x(d.stateName)+3; })
	.attr("width", barwidth+6)
	.attr("y", function(d) {return y(-(d.thermal+d.hydro+d.nuclear))-10; })
	.attr("height", function(d) {return  height - y(-(d.thermal+d.nuclear+d.hydro))+10; })
	  ;
	  
	   div.transition()        
	   .duration(200)      
	   .style("opacity", .9);
	   
	div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Generation:</strong> <span style='color:steelblue;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) +"</span>")  
	   .style("left", (d3.event.pageX-205) + "px")     
	   .style("top", (d3.event.pageY-105) + "px");
	  
	 })
	.on('mouseout',function(d){
		
	 d3.select(this)
	 .transition()  // adds a "smoothing" animation to the transition
	 .duration(500)
	  .attr("x", function(d) { return x(d.stateName)+2; })
	.attr("width", barwidth-6)
	.attr("y", function(d) { return y(-(d.thermal+d.hydro+d.nuclear)); })
	.attr("height", function(d) {return height - y(-(d.thermal+d.nuclear+d.hydro)); })
	  
	    ;
	 div.transition()        
	 .duration(500)      
	 .style("opacity", 0);
	 });
	d3.select("input#thermal_check").on("change", change);

	var sortTimeout = setTimeout(function() {
	d3.select("input").on("change",change);
	},750);

	function change() {
	clearTimeout(sortTimeout);
	var x0 = x.domain(data.sort(this.checked
	  ? function(a, b) {return (b.thermal+b.hydro+b.nuclear) - (a.thermal+a.hydro+a.nuclear);}
	  : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
	  .map(function(d) { return d.stateName; }))
	  .copy();

	var transition = svg.transition().duration(750),
	  delay = function(d, i) { return i * 50; };

	transition.selectAll("rect")
	  .delay(delay)
	  .attr("x", function(d) { return x0(d.stateName); });

	transition.select(".x.axis")
	  .call(xAxis)
	 .selectAll("text")
	.style("text-anchor", "end")
    .style("font-weight", "bold")
	.attr("dx", "-0.5em")
	.attr("dy", "-2em")
	.attr("transform", "rotate(-65)" )

	.selectAll("g")
	  .delay(delay);
	}

	});
$("#thermal").hide(0).delay(500).fadeIn(3000);


});

	
	


}
} ]);

genControllers.controller('stateCtrl', [ '$scope','Record3','$location',
                                  		'$http',function($scope,Record3,$location,$http) {

	
	var select = document.getElementById('statelbl');

	
	
	d3.json("../consumptions?find=ByState&state=abc", function(error, data1) {	// Go to the data folder (in the current directory) and read in the data.tsv file
		data1.forEach(function(d) {	// For all the data values carry out the following
			
			  var opt = document.createElement('option');
			    opt.value = d;
			    opt.innerHTML = d;
			    select.appendChild(opt);
		});
    var c=0;
		$scope.generateGraph=function()
	     {
	    	buildChart();
	     };
	     var margin = {top: 30, right: 10, bottom: 150, left: 50},
         width = 700 - margin.left - margin.right,
         height = 600 - margin.top - margin.bottom;

     // Parse the date / time
     var h= document.createElement('h3');
     h.innerHTML='Statewise Consumption-Generation Chart';
    document.getElementById("header").appendChild(h);
    document.getElementById("thermal").innerHTML="";
    function buildChart()
    {
   	
  	  if(c!=0)
		 {
   	 document.getElementById("thermal").innerHTML="";
	     document.getElementById("legend").innerHTML="";
		 }
  	  c++;
     var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);

     var y = d3.scale.linear().range([height, 0]);
     
     var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom")
         .tickSize(20);

     var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left")
         .ticks(25);

     var svg = d3.select("#thermal").append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
       .append("g")
         .attr("transform", 
               "translate(" + margin.left + "," + margin.top + ")");
    
    
  
                          
     var div = d3.select("#thermal").append("div")   
     .attr("class", "tooltip")               
     .style("opacity", 0);
     var dataConsuption;
     var maxYValue;
 
     d3.json("../consumptions?find=ByStateNameEquals&stateName="+$scope.state, function(error, data1) {				// Go to the data folder (in the current directory) and read in the data.tsv file
  		data1.forEach(function(d) {								// For all the data values carry out the following
  			d.consYear=+d.consYear;
  			d.thermal=+d.thermal;
  			d.nuclear=+d.nuclear;
  			d.hydro=+d.hydro;
  			
  			// makesure d.data is a number, not a string
  		});
  		dataConsuption=data1;
  		 d3.json("../generations?find=ByStateNameEquals&stateName="+$scope.state, function(error, data) {

  	         data.forEach(function(d) {
  	        	
  	        	 
  	             d.genYear=+d.genYear;
  	             d.hydro=+d.hydro;
  	             d.nuclear=+d.nuclear;
  	             d.thermal = +d.thermal;
  	         });
  	         

  	         var maxYValueGeneration=d3.max(data, function(d) { return d.thermal+d.hydro+d.nuclear; });
  	     	var maxYValueConsuption=d3.max(dataConsuption, function(d) { return d.thermal+d.hydro+d.nuclear; });
  	          maxYValue=d3.max([maxYValueGeneration,maxYValueConsuption]);
  	         var maxYear=d3.max(data,function(d){return d.genYear});
  	         var barwidth=30;
  	       x.domain(data.map(function(d) { return d.genYear; }));
  	       y.domain([0,maxYValue]);

  	       svg.append("g")
  	           .attr("class", "x axis")
  	           .attr("transform", "translate(0," + height + ")")
  	           .call(xAxis)
  	         .selectAll("text")
  	           .style("text-anchor", "end")
  	           .style("font-size",15)
  	           .attr("dx", "-0.5em")
  	           .attr("dy", "-2em")
  	           .attr("transform", "rotate(-65)" );

  	       svg.append("g")
  	           .attr("class", "y axis")
  	           .call(yAxis)
  	         .append("text")
  	           .attr("transform", "rotate(-90)")
  	           .attr("y", 6)
  	           .attr("dy", ".71em")
  	           .style("text-anchor", "end");
  	           
  	       
  	       svg.selectAll("bar")
  	           .data(data)
  	         .enter().append("rect")
  	           .style("fill", "steelblue")
  	            .style("opacity", function(d){if(d.genYear==maxYear)return .5;else return .9;})
  	           .attr("x", function(d) { return x(d.genYear); })
  	           .attr("width", barwidth-6)
  	           .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
  	           .attr("height", function(d) { return height - y(d.thermal+d.nuclear+d.hydro); })
  	           .on('mouseover',function(d){
  	          	
  	              d3.select(this)
  	              .transition()  // adds a "smoothing" animation to the transition
  	            .duration(200)
  	               .attr("x", function(d) { return x(d.genYear); })
  	           .attr("width", barwidth+3)
  	           .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear)-10; })
  	           .attr("height", function(d) { return height - y(d.thermal+d.nuclear+d.hydro)+10; })
  	              .style('fill','#008cff');
  	             
  	              div.transition()        
  	              .duration(200)      
  	              .style("opacity", .9);  
  	              if(d.genYear==maxYear)
  	            	{div.html( "<strong>Projected Generation of Year:</strong> <span style='color:#66ccff;font-weight:bold'>" + d.genYear + "</span> <strong>Generation:</strong> <span style='color:red;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) + "</span>")  
  	    	          .style("left", (d3.event.pageX-225) + "px")     
  	    	          .style("top", (d3.event.pageY-115) + "px");}else
  	            		{
  	          div .html( "<strong>Year:</strong> <span style='color:#66ccff;font-weight:bold'>" + d.genYear + "</span> <strong>Generation:</strong> <span style='color:steelblue;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) + "</span>")  
  	              .style("left", (d3.event.pageX-220) + "px")     
  	              .style("top", (d3.event.pageY-110) + "px");
  	            		}
  	             
  	            })
  	         .on('mouseout',function(d){
  	        	
  	            d3.select(this)
  	            .transition()  // adds a "smoothing" animation to the transition
  	            .duration(500)
  	             .attr("x", function(d) { return x(d.genYear); })
  	           .attr("width", barwidth-6)
  	           .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
  	           .attr("height", function(d) { return height - y(d.thermal+d.nuclear+d.hydro); })
  	              .style('fill','steelblue')
  	               ;
  	            div.transition()        
  	            .duration(500)      
  	            .style("opacity", 0);
  	            });
  	       
  	     
  	       svg.selectAll("bar")
  	       .data(dataConsuption)
  	        .enter().append("rect")
  	       .style("fill", "#990400")
  	       .style("opacity", function(d){if(d.consYear==maxYear)return .5;else return .9;})
  	       .attr("x", function(d) { return x(d.consYear)+40; })
  	       .attr("width", barwidth-6)
  	       .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
  	       .attr("height", function(d) { return height - y(d.thermal+d.hydro+d.nuclear); })
  	       .on('mouseover',function(d){
  	      	   d3.select(this)
  	           .transition()  // adds a "smoothing" animation to the transition
  	        .duration(300)
  	           .attr("x", function(d) { return x(d.consYear)+30; })
  	       .attr("width", barwidth+6)
  	       .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear)-10; })
  	       .attr("height", function(d) { return height - y(d.thermal+d.hydro+d.nuclear)+10; })
  	          .style('fill','red');
  	          div.transition()        
  	          .duration(200)      
  	          .style("opacity", .9);     
  	          if(d.consYear==maxYear)
  	        {
  	           div.html( "<strong>Projected consumption of Year:</strong> <span style='color:#66ccff;font-weight:bold'>" + d.consYear + "</span> <strong>Consumption:</strong> <span style='color:red;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) + "</span>")  
  	          .style("left", (d3.event.pageX-225) + "px")     
  	          .style("top", (d3.event.pageY-115) + "px");
  	        }else
  	        	{
  	        	div.html( "<strong>Year:</strong> <span style='color:#66ccff;font-weight:bold'>" + d.consYear + "</span> <strong>Consumption:</strong> <span style='color:red;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) + "</span>")  
    	          .style("left", (d3.event.pageX-225) + "px")     
    	          .style("top", (d3.event.pageY-115) + "px");
  	        	}
  	         
  	        })
  	     .on('mouseout',function(d){
  	    	
  	        d3.select(this)
  	        .transition()  // adds a "smoothing" animation to the transition
  	        .duration(500)
  	         .attr("x", function(d) { return x(d.consYear)+40; })
  	       .attr("width", barwidth-6)
  	       .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
  	       .attr("height", function(d) { return height - y(d.thermal+d.hydro+d.nuclear); })
  	          .style('fill','#990400');
  	        div.transition()        
  	        .duration(500)      
  	        .style("opacity", 0);
  	        });
  	       
  	       var svg1 = d3.select("#legend").append("svg")
  	       .attr("width",300)
  	       .attr("height",30);
  	       var legend = svg1.append("g");
  	       
  	       

  	       legend.selectAll('g').data(data)
  	         .enter()
  	         .append('g')
  	         .append("rect")
  	             .attr("x", 30)
  	             .attr("y", 2)
  	             .attr("width", 21)
  	             .attr("height", 21)
  	             .style("fill","blue");


  	       svg1.append('text').text('GENERATION')
  	       .attr('x', 55)
  	       .attr('y', 19)
  	       .attr('fill', 'black')  ;  
  	           
  	       var legend = svg1.append("g");

  	       legend.selectAll('g').data(data)
  	       .enter()
  	       .append('g')
  	       .append("rect")
  	           .attr("x", 160)
  	           .attr("y", 2)
  	           .attr("width", 21)
  	           .attr("height", 21)
  	           .style("fill","red");


  	       svg1.append('text').text('CONSUMPTION')
  	       .attr('x',188 )
  	       .attr('y', 19)
  	       .attr('fill', 'black')  ; 
  	       
  	   });
  		
  	
 });

    
    }
	     

	});
	
                                  		
                                  		
                                  			
                                  		
                                  } ]);
genControllers.controller('generationCtrl', [ '$scope','Record1','Record2','$location',
                                  		'$http',function($scope,Record1,Record2,$location,$http) {

	
	
	
	var maxYear=null;
	var minYear=null;
	var c=0;
	   var h= document.createElement('h3');
       h.innerHTML='Overall Generation Statewise';
      document.getElementById("header").appendChild(h);
      $http.get("../consumptions").then(function(response){var data3=response.data;
      maxYear=d3.max(data3,function(d){return d.consYear;});
      minYear=d3.min(data3,function(d){return d.consYear;});
      $scope.value = "2013";
      $scope.options = {       
        from: minYear,
        to: maxYear,
        step: 1,
        dimension: " Year",
        
      };
      buildChart();
      });
/*	d3.json("../consumptions", function(error, data1) {	// Go to the data folder (in the current directory) and read in the data.tsv file
		data1.forEach(function(d) {	// For all the data values carry out the following
			d.stateName=d.stateName;
			d.thermal=+d.thermal;
			d.nuclear=+d.nuclear;
			d.consYear=+d.consYear;
			d.hydro=+d.hydro;// make sure all these are numbers, not string
		});
		
	maxYear=d3.max(data1, function(d) { return d.consYear; });
    minYear=d3.min(data1, function(d){return d.consYear;});
	buildChart();
		
	});
	minYear=2011;
	maxYear=2016;
	 $scope.value = "2013";
     $scope.options = {       
       from: minYear,
       to: maxYear,
       step: 1,
       dimension: " Year"
   };*/
     
   
   $scope.sliderChange=function()
     {document.getElementById("thermal_check").checked=false;
    	buildChart();
     };
    
     
     function buildChart()
     {
     if(c!=0)
    		 {
    	 document.getElementById("thermal").innerHTML="";
    	 document.getElementById("legend").innerHTML="";
    		 }
    	 c++;
    	 var margin = {top: 20, right: 20, bottom: 140, left: 60},
    	    width = 1000 - margin.left - margin.right,
    	    height = 600 - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
        var y = d3.scale.linear().range([height, 0]);
    	var xAxis = d3.svg.axis()
    	    .scale(x)
    	    .orient("bottom")
    	    .tickSize(0);

    	var yAxis = d3.svg.axis()
    	    .scale(y)
    	    .orient("left")
    	    .ticks(25);

    	var svg = d3.select("#thermal").append("svg")
    	    .attr("width", width + margin.left + margin.right)
    	    .attr("height", height + margin.top + margin.bottom)
    	  .append("g")
    	    .attr("transform", 
    	          "translate(" + margin.left + "," + margin.top + ")");

    	var div = d3.select("#thermal").append("div")   
    	.attr("class", "tooltip")               
    	.style("opacity", 0)
    	;

    	d3.json("../generations?find=ByGenYear&genYear="+$scope.value, function(error, data) {
    		 data.forEach(function(d) {
    	   
    	    	d.stateName=d.stateName;
    	        d.hydro=+d.hydro;
    	        d.nuclear=+d.nuclear;
    	        d.thermal = +d.thermal;
    	    	
    	    });
    	   
    	  var barwidth=width/data.length;
    	  x.domain(data.map(function(d) { return d.stateName; }));
    	  y.domain([0, d3.max(data, function(d) { return d.thermal+d.hydro+d.nuclear; })]);
    	  
    	  svg.append("g")
    	  .attr("class", "x axis")
    	  .attr("transform", "translate(0," + height + ")")
    	  .call(xAxis)
    	.selectAll("text")
    	  .style("text-anchor", "end")
    	  .style("font-weight", "bold")
    	  .attr("dx", "-.8em")
    	  .attr("dy", "-.55em")
    	  .attr("transform", "rotate(-65)" );

    	svg.append("g")
    	  .attr("class", "y axis")
    	  .call(yAxis)
    	.append("text")
    	  .attr("transform", "rotate(-90)")
    	  .attr("y", 6)
    	  .attr("dy", ".71em")
    	  .style("text-anchor", "end");

      svg.selectAll("bar")
    	.data(data)
    	.enter().append("rect")
    	.style("fill", "#0070cc")
    	.attr("x", function(d) { return x(d.stateName); })
    	.attr("y", function(d){
    	      return y(+d.thermal);
    	  } )
    	  .attr("width", barwidth-2)
    	 .attr("height", function(d){
    	  return Math.abs(y(+d.thermal) - y(0) );
    	 } )
    	 .on("mouseover", function(d) {  
    		  d3.select(this)
    		  .transition()        
             .duration(500)
    	      .style('fill','#008cff');
    	     
    	    var total=d.thermal+d.hydro+d.nuclear;
    		 total=total.toFixed(3);
    	            div.transition()        
    	                .duration(200)      
    	                .style("opacity", .9);      
    	            div .html( "<strong>Total:</strong> <span style='color:#66ccff;font-weight:bold'>" + total + "</span> <strong>Thermal:</strong> <span style='color:steelblue;font-weight:bold'>" + d.thermal + "</span>")  
    	                .style("left", (d3.event.pageX-205) + "px")     
    	                .style("top", (d3.event.pageY-105) + "px");    
    	            })                  
    	        .on("mouseout", function(d) {  
    	        	 d3.select(this)
    	        	 .transition()        
                     .duration(500)
    	             .style('fill','#0070cc');
    	            
    	            div.transition()        
    	                .duration(500)      
    	                .style("opacity", 0);   
    	        });
    	svg.selectAll("bar")
    	.data(data)
    	.enter().append("rect")
    	 
    	  .attr("y", function(d){
    	    return y(+d.thermal + +d.hydro);
    	} )
    	.style("fill", "#990400")
    	.attr("x", function(d) { return x(d.stateName); })
    	   
    	.attr("width", barwidth-2)
    	.attr("height", function(d){
    	    return Math.abs( y(+d.hydro) - y(0) );
    	   } )
    	.on("mouseover", function(d) { 
    		 d3.select(this)
    		 .transition()        
             .duration(500)
    	     .style('fill','red');
    	    	
    		 var total=d.thermal+d.hydro+d.nuclear;
    		 total=total.toFixed(3);
    	             div.transition()        
    	                .duration(200)      
    	                .style("opacity", .9);      
    	            div .html( "<strong>Total:</strong> <span style='color:#66ccff;font-weight:bold'>" + total + "</span> <strong>Hydro:</strong> <span style='color:red;font-weight:bold'>" + d.hydro + "</span>")  
    	                .style("left", (d3.event.pageX-205) + "px")     
    	                .style("top", (d3.event.pageY-105) + "px");    
    	            })                  
    	            	.on("mouseout", function(d) {   
    	        	 d3.select(this)
    	        	 .transition()        
                     .duration(500)
    	             .style('fill','#990400');
    	            div.transition()        
    	                .duration(500)      
    	                .style("opacity", 0);   
    	        });;  
    	  
    	svg.selectAll("bar")
    	.data(data)
    	.enter().append("rect")
    	 
    	  .attr("y", function(d){
    	    return y(+d.thermal + +d.hydro +d.nuclear);
    	} )
    	.style("fill", "#cca300")
    	.attr("x", function(d) { return x(d.stateName); })
    	    
    	.attr("width", barwidth-2)
    	.attr("height", function(d){
    	    return Math.abs( y(+d.nuclear) - y(0) );})
    	    .on("mouseover", function(d) {  
    	    	d3.select(this)
    	    	.transition()        
                .duration(500)
    	        .style('fill','#ffff43');
    	    	
    		 var total=d.thermal+d.hydro+d.nuclear;
    		 total=total.toFixed(3);
    	            div.transition()        
    	                .duration(200)      
    	                .style("opacity", .9);      
    	            div .html( "<strong>Total:</strong> <span style='color:#66ccff;font-weight:bold'>" + total + "</span> <strong>Nuclear:</strong> <span style='color:#cca300;font-weight:bold'>" + d.nuclear + "</span>")  
    	                .style("left", (d3.event.pageX-205) + "px")     
    	                .style("top", (d3.event.pageY-105) + "px");    
    	            })                  
    	        .on("mouseout", function(d) {   
    	        	d3.select(this)
    	        	.transition()        
                    .duration(500)
    	            .style('fill','#cca300');
    	            div.transition()        
    	                .duration(500)      
    	                .style("opacity", 0);   
    	        });

    	d3.select("input#thermal_check").on("change", change);

    	var sortTimeout = setTimeout(function() {
    	  d3.select("input").on("change",change);
    	},300);

    	function change() {
    	  clearTimeout(sortTimeout);
         var x0 = x.domain(data.sort(this.checked
    	      ? function(a, b) {return (b.thermal+b.hydro+b.nuclear) - (a.thermal+a.nuclear+a.hydro);}
    	      : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
    	      .map(function(d) { return d.stateName; }))
    	      .copy();

    	  var transition = svg.transition().duration(300),
    	      delay = function(d, i) { return i * 25; };

    	  transition.selectAll("rect")
    	      .delay(delay)
    	      .attr("x", function(d) { return x0(d.stateName); });

    	  transition.select(".x.axis")
    	      .call(xAxis)
    	      .selectAll("text")
    	   .style("text-anchor", "end")
    	   .style("font-weight", "bold")
    	   .attr("dx", "-.8em")
    	   .attr("dy", "-.55em")
    	   .attr("transform", "rotate(-65)" )
    	    .selectAll("g")
    	      .delay(delay);
    	}
    	
    	 var svg1 = d3.select("#legend").append("svg")
         .attr("width",300)
         .attr("height",30);
    	
    	var legend = svg1.append("g");
    	  
    	  

    	legend.selectAll('g').data(data)
    	  .enter()
    	  .append('g')
    	  .append("rect")
    	      .attr("x", 10)
    	      .attr("y", 2)
    	      .attr("width", 21)
    	      .attr("height", 21)
    	      .style("fill","blue");


    	svg1.append('text').text('THERMAL')
    	.attr('x', 35)
    	.attr('y', 19)
    	.attr('fill', 'black')  ;  
    	    
    	var legend = svg1.append("g");

    	legend.selectAll('g').data(data)
    	.enter()
    	.append('g')
    	.append("rect")
    	    .attr("x", 105)
    	    .attr("y", 2)
    	    .attr("width", 21)
    	    .attr("height", 21)
    	    .style("fill","red");


    	svg1.append('text').text('HYDRO')
    	.attr('x',130 )
    	.attr('y', 19)
    	.attr('fill', 'black')  ;  
    	  
    	var legend = svg1.append("g");

    	legend.selectAll('g').data(data)
    	.enter()
    	.append('g')
    	.append("rect")
    	    .attr("x", 183)
    	    .attr("y", 2)
    	    .attr("width", 21)
    	    .attr("height", 21)
    	    .style("fill","Yellow");


    	svg1.append('text').text('NUCLEAR')
    	.attr('x',210)
    	.attr('y', 19)
    	.attr('fill', 'black')  ;
    	  

    	});

    	
    	 $("#thermal").hide(0).delay(500).fadeIn(3000); 
    	 
     }
       
  } ]);

genControllers.controller('consumptionChartCtrl', [ '$scope','Record1','$location',
                                  		'$http',function($scope,Record1,$location,$http) {
                  
	
	
	
	
	var maxYear=null;
	var minYear=null;
	$http.get("../consumptions").then(function(response){var data3=response.data;
	maxYear=d3.max(data3,function(d){return d.consYear;});
	minYear=d3.min(data3,function(d){return d.consYear;});
	$scope.value = "2013";
	$scope.options = {       
	  from: minYear,
	  to: maxYear,
	  step: 1,
	  dimension: " Year",
	  
	};
	buildChart();
	});
	

     var c=0;
   
   
     
    $scope.sliderChange=function()
     {document.getElementById("thermal_check").checked=false;
    	buildChart();
     };
    
var margin = {top: 20, right: 20, bottom: 140, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

 var h= document.createElement('h3');
 h.innerHTML='Overall consumption StateWise';
document.getElementById("header").appendChild(h);

function buildChart()
{
	 if(c!=0)
		 {
    	 document.getElementById("thermal").innerHTML="";
	     document.getElementById("legend").innerHTML="";
		 }
 	
    	 c++;
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(25);

var svg1 = d3.select("#legend").append("svg")
.attr("width",300)
.attr("height",30);

var svg = d3.select("#thermal").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#thermal").append("div")   
.attr("class", "tooltip")               
.style("opacity", 0)
;

d3.json("../consumptions?find=ByConsYear&consYear="+$scope.value, function(error, data) {

    data.forEach(function(d) {
    
        d.hydro=+d.hydro;
        d.nuclear=+d.nuclear;
        d.thermal = +d.thermal;
    });
 var maxYValueConsuption=d3.max(data, function(d) { return d.thermal+d.hydro+d.nuclear; });
       
 var barwidth=width/data.length;
  x.domain(data.map(function(d) { return d.stateName; }));
  y.domain([0,maxYValueConsuption]);
  
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
.selectAll("text")
  .style("text-anchor", "end")
  .style("font-weight", "bold")
  .attr("dx", "-.8em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-65)" );

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end");

svg.selectAll("bar")
.data(data)
.enter().append("rect")
.style("fill", "#0070cc")
.attr("x", function(d) { return x(d.stateName); })
.attr("y", function(d){
      return y(+d.thermal);
  } )
  .attr("width", barwidth-2)
 .attr("height", function(d){
  return Math.abs(y(+d.thermal) - y(0) );
 } )
 .on("mouseover", function(d) {  
	  d3.select(this)
	  .transition()        
       .duration(500)
      .style('fill','#008cff')
      .attr("width", barwidth-2);
      
      
	 var total=d.thermal+d.hydro+d.nuclear;
	 total=total.toFixed(3);
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html( "<strong>Total:</strong> <span style='color:#66ccff;font-weight:bold'>" + total + "</span> <strong>Thermal:</strong> <span style='color:steelblue;font-weight:bold'>" + d.thermal + "</span>")  
                .style("left", (d3.event.pageX-65) + "px")     
                .style("top", (d3.event.pageY-65) + "px");    
            })                  
        .on("mouseout", function(d) {  
        	 d3.select(this)
        	 .transition()        
             .duration(500)
             .style('fill','#0070cc');
            
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
svg.selectAll("bar")
.data(data)
.enter().append("rect")
 
  .attr("y", function(d){
    return y(+d.thermal + +d.hydro);
} )
.style("fill", "#990400")
.attr("x", function(d) { return x(d.stateName); })
  
.attr("width", barwidth-2)
.attr("height", function(d){
    return Math.abs( y(+d.hydro) - y(0) );
 } )
.on("mouseover", function(d) { 
	 d3.select(this)
	 .transition()        
     .duration(500)
     .style('fill','red');
    	
	 var total=d.thermal+d.hydro+d.nuclear;
	 total=total.toFixed(3);
             div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html( "<strong>Total:</strong> <span style='color:#66ccff;font-weight:bold'>" + total + "</span> <strong>Hydro:</strong> <span style='color:red;font-weight:bold'>" + d.hydro + "</span>")  
                .style("left", (d3.event.pageX-65) + "px")     
                .style("top", (d3.event.pageY-65) + "px");    
            })                  
            	.on("mouseout", function(d) {   
        	 d3.select(this)
        	 .transition()        
             .duration(500)
             .style('fill','#990400');
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });;  
  
svg.selectAll("bar")
.data(data)
.enter().append("rect")
 
  .attr("y", function(d){
    return y(+d.thermal + +d.hydro +d.nuclear);
} )
.style("fill", "#cca300")
.attr("x", function(d) { return x(d.stateName); })
.attr("width", barwidth-2)
.attr("height", function(d){
    return Math.abs( y(+d.nuclear) - y(0) );})
    .on("mouseover", function(d) {  
    	d3.select(this)
    	.transition()        
             .duration(500)
        .style('fill','#ffff43');
    	
	 var total=d.thermal+d.hydro+d.nuclear;
	 total=total.toFixed(3);
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html( "<strong>Total:</strong> <span style='color:#66ccff;font-weight:bold'>" + total + "</span> <strong>Nuclear:</strong> <span style='color:#cca300;font-weight:bold'>" + d.nuclear + "</span>")  
                .style("left", (d3.event.pageX-205) + "px")     
                .style("top", (d3.event.pageY-105) + "px");    
            })                  
        .on("mouseout", function(d) {   
        	d3.select(this)
        	.transition()        
             .duration(500)
            .style('fill','#cca300');
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

d3.select("input#thermal_check").on("change", change);

var sortTimeout = setTimeout(function() {
  d3.select("input").on("change",change);
},300);

function change() {
  clearTimeout(sortTimeout);
 var x0 = x.domain(data.sort(this.checked
      ? function(a, b) {return (b.thermal+b.hydro+b.nuclear) - (a.thermal+a.nuclear+a.hydro);}
      : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
      .map(function(d) { return d.stateName; }))
      .copy();

  var transition = svg.transition().duration(300),
      delay = function(d, i) { return i * 25; };

  transition.selectAll("rect")
      .delay(delay)
      .attr("x", function(d) { return x0(d.stateName); });

  transition.select(".x.axis")
      .call(xAxis)
      .selectAll("text")
   .style("text-anchor", "end")
   .style("font-weight", "bold")
   .attr("dx", "-.8em")
   .attr("dy", "-.55em")
   .attr("transform", "rotate(-65)" )
    .selectAll("g")
      .delay(delay);
}


//add legend   
var legend = svg1.append("g");
  
legend.selectAll('g').data(data)
  .enter()
  .append('g')
  .append("rect")
      .attr("x", 10)
      .attr("y", 2)
      .attr("width", 21)
      .attr("height", 21)
      .style("fill","#0070cc");


svg1.append('text').text('THERMAL')
.attr('x', 35)
.attr('y', 19)
.attr('fill', 'black')  ;  
    
var legend = svg1.append("g");

legend.selectAll('g').data(data)
.enter()
.append('g')
.append("rect")
    .attr("x", 105)
    .attr("y", 2)
    .attr("width", 21)
    .attr("height", 21)
    .style("fill","#990400");


svg1.append('text').text('HYDRO')
.attr('x',130 )
.attr('y', 19)
.attr('fill', 'black')  ;  
  
var legend = svg1.append("g");

legend.selectAll('g').data(data)
.enter()
.append('g')
.append("rect")
    .attr("x", 183)
    .attr("y", 2)
    .attr("width", 21)
    .attr("height", 21)
    .style("fill","#cca300");


svg1.append('text').text('NUCLEAR')
.attr('x',210)
.attr('y', 19)
.attr('fill', 'black')  ;
  
$("#thermal").hide(0).delay(500).fadeIn(3000);
});
}

} ]);

genControllers.controller('thermalConsumptionCtrl', [ '$scope','Record1','$location',
                                     		'$http',function($scope,Record1,$location,$http) {
                                              
   
	
	var maxYear=null;
	var minYear=null;
	
	
	$http.get("../consumptions").then(function(response){var data3=response.data;
	maxYear=d3.max(data3,function(d){return d.consYear;});
	minYear=d3.min(data3,function(d){return d.consYear;});
	$scope.value = "2013";
	$scope.options = {       
	  from: minYear,
	  to: maxYear,
	  step: 1,
	  dimension: " Year",
	  
	};
	buildChart();
	});
     var c=0;
	
     var margin = {top: 30, right: 10, bottom: 150, left: 40},
     width = 1000 - margin.left - margin.right,
     height = 600 - margin.top - margin.bottom;

var h= document.createElement('h3');
  h.innerHTML='Thermal Consumption StateWise';
 document.getElementById("header").appendChild(h);
 $scope.sliderChange=function()
 {
	 document.getElementById("thermal_check").checked=false;
	buildChart();
	 
 };
     
	function buildChart()
	{
	
   if(c!=0)
	 {
	 document.getElementById("thermal").innerHTML="";
   document.getElementById("legend").innerHTML="";
	 }

	 c++;

   var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

   var y = d3.scale.linear().range([height, 0]);
   
   var xAxis = d3.svg.axis()
       .scale(x)
       .orient("bottom")
       .tickSize(0);

   var yAxis = d3.svg.axis()
       .scale(y)
       .orient("left")
       .ticks(10);

   var svg = d3.select("#thermal").append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
        .append("g")
       .attr("transform", 
             "translate(" + margin.left + "," + margin.top + ")");
   
   var div = d3.select("#thermal").append("div")   
   .attr("class", "tooltip")               
   .style("opacity", 0)
   ;
   
   d3.json("../consumptions?find=ByConsYear&consYear="+$scope.value, function(error, data) {

       data.forEach(function(d) {
       
           d.hydro=+d.hydro;
           d.nuclear=+d.nuclear;
           d.thermal = +d.thermal;
       });
       var barwidth=width/data.length;
     x.domain(data.map(function(d) { return d.stateName; }));
     y.domain([0, d3.max(data, function(d) { return d.thermal; })]);

     svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)
       .selectAll("text")
        .style("text-anchor", "end")
  .style("font-weight", "bold")
  .attr("dx", "-.7em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-65)" );

     svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
       .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", ".71em")
         .style("text-anchor", "end");
         
     
     svg.selectAll("bar")
         .data(data)
       .enter().append("rect")
         .style("fill", "steelblue")
         .attr("x", function(d) { return x(d.stateName); })
         .attr("width", barwidth-2)
         .attr("y", function(d) { return y(d.thermal); })
         .attr("height", function(d) { return height - y(d.thermal); })
        .on('mouseover',function(d){
        	 var state=d.stateName;
        	 if(state=="Andhra Pradesh")
        		 state="Andhra";
        	 if(state=="MADHYA PRADESH")
        		 state="M.P.";
        	 if(state=="UTTAR PRADESH")
        		 state="U.P.";
        	 if(state=="JAMMU AND KASHMIR")
        		 state="J&K";
        	 if(state=="ARUNACHAL PRADESH")
        		 state="Arunachal";
            d3.select(this)
            .transition()
            .duration(200)
            .style('fill','#008cff')
             .attr("x", function(d) { return x(d.stateName)+1; })
         .attr("width", barwidth+2)
         .attr("y", function(d) { return y(d.thermal)-10; })
         .attr("height", function(d) { return height - y(d.thermal)+10; });
            div.transition()        
            .duration(200)      
            .style("opacity", .9);      
        div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Thermal:</strong> <span style='color:steelblue;font-weight:bold'>" + d.thermal + "</span>")  
            .style("left", (d3.event.pageX-205) + "px")     
            .style("top", (d3.event.pageY-105) + "px");
             
           })
       .on('mouseout',function(d){
      	
          d3.select(this)
          .transition()
          .duration(500)
            .style('fill','steelblue')
             .attr("x", function(d) { return x(d.stateName); })
         /*.attr("width", barwidth-2)*/
         .attr("y", function(d) { return y(d.thermal); })
         .attr("height", function(d) { return height - y(d.thermal); });
          div.transition()        
          .duration(500)      
          .style("opacity", 0);
          });
     
     d3.select("input#thermal_check").on("change", change);
    
     var sortTimeout = setTimeout(function() {
       d3.select("input").on("change",change);
     },750);

     function change() {
       clearTimeout(sortTimeout);
      var x0 = x.domain(data.sort(this.checked
           ? function(a, b) {return b.thermal - a.thermal;}
           : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
           .map(function(d) { return d.stateName; }))
           .copy();

       var transition = svg.transition().duration(750),
           delay = function(d, i) { return i * 50; };

       transition.selectAll("rect")
           .delay(delay)
           .attr("x", function(d) { return x0(d.stateName); });

       transition.select(".x.axis")
           .call(xAxis)
           .selectAll("text")
         .style("text-anchor", "end")
  .style("font-weight", "bold")
  .attr("dx", "-.7em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-65)" )
         .selectAll("g")
           .delay(delay);
     }
    
          
     });
   $("#thermal").hide(0).delay(500).fadeIn(3000); 
	}



   } ]);



genControllers.controller('hydroConsumptionCtrl', [ '$scope','Record1','$location',
                                    		'$http',function($scope,Record1,$location,$http) {
                                             
  

  // Parse the date / time
 

  
  
  var maxYear=null;
	var minYear=null;
	
	
	$http.get("../consumptions").then(function(response){var data3=response.data;
	maxYear=d3.max(data3,function(d){return d.consYear;});
	minYear=d3.min(data3,function(d){return d.consYear;});
	$scope.value = "2013";
	$scope.options = {       
	  from: minYear,
	  to: maxYear,
	  step: 1,
	  dimension: " Year",
	  
	};
	buildChart();
	});
   var c=0;
	
   var margin = {top: 30, right: 10, bottom: 150, left: 40},
   width = 1000 - margin.left - margin.right,
   height = 600 - margin.top - margin.bottom;

var h= document.createElement('h3');
h.innerHTML='Hydro Consumption StateWise';
document.getElementById("header").appendChild(h);
$scope.sliderChange=function()
{document.getElementById("thermal_check").checked=false;
	buildChart();
};
   
	function buildChart()
	{
	
 if(c!=0)
	 {
	 document.getElementById("thermal").innerHTML="";
 document.getElementById("legend").innerHTML="";
	 }

	 c++;

  
  
  
  
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

  var y = d3.scale.linear().range([height, 0]);
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(0);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var svg = d3.select("#thermal").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
  
  var div = d3.select("#thermal").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0)
  ;

  d3.json("../consumptions?find=ByConsYear&consYear="+$scope.value, function(error, data) {

      data.forEach(function(d) {
      
          d.hydro=+d.hydro;
          d.nuclear=+d.nuclear;
          d.thermal = +d.thermal;
      });
    var barwidth=width/data.length;
    x.domain(data.map(function(d) { return d.stateName; }));
    y.domain([0, d3.max(data, function(d) { return d.hydro; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
       .style("text-anchor", "end")
  .style("font-weight", "bold")
  .attr("dx", "-.7em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-65)" );
    svg.append("g")
       .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
        
    
    svg.selectAll("bar")
     
        .data(data)
        .enter().append("rect")
        .style("fill", "#990400")
        .attr("x", function(d) { return x(d.stateName); })
        .attr("width", barwidth-2)
        .attr("y", function(d) { return y(d.hydro); })
        .attr("height", function(d) { return height - y(d.hydro); })
        
        .on('mouseover',function(d){
       	 var state=d.stateName;
       	 if(state=="Andhra Pradesh")
       		 state="Andhra";
       	 if(state=="MADHYA PRADESH")
       		 state="M.P.";
       	 if(state=="UTTAR PRADESH")
       		 state="U.P.";
       	 if(state=="JAMMU AND KASHMIR")
       		 state="J&K";
       	 if(state=="ARUNACHAL PRADESH")
       		 state="Arunachal";
           d3.select(this)
           .transition()
          .duration(200)
           .style('fill','red')
           .attr("x", function(d) { return x(d.stateName)+1; })
        .attr("width", barwidth+2)
        .attr("y", function(d) { return y(d.hydro)-10; })
        .attr("height", function(d) { return height - y(d.hydro)+10; });
           div.transition()        
           .duration(200)      
           .style("opacity", .9);      
       div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Hydro:</strong> <span style='color:steelblue;font-weight:bold'>" + d.hydro + "</span>")  
           .style("left", (d3.event.pageX-205) + "px")     
           .style("top", (d3.event.pageY-205) + "px");
          })
      .on('mouseout',function(d){
     	
         d3.select(this)
         .transition() 
         .duration(500)
          .attr("x", function(d) { return x(d.stateName); })
        .attr("width", barwidth-2)
        .attr("y", function(d) { return y(d.hydro); })
        .attr("height", function(d) { return height - y(d.hydro); })
           .style('fill','#990400');
         div.transition()        
         .duration(500)      
         .style("opacity", 0);
         });
    
    d3.select("input#thermal_check").on("change", change);
   
    var sortTimeout = setTimeout(function() {
      d3.select("input").on("change",change);
    },750);

    function change() {
      clearTimeout(sortTimeout);
      var x0 = x.domain(data.sort(this.checked
          ? function(a, b) {return b.hydro - a.hydro;}
          : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
          .map(function(d) { return d.stateName; }))
          .copy();

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      transition.selectAll("rect")
          .delay(delay)
          .attr("x", function(d) { return x0(d.stateName); });

      transition.select(".x.axis")
          .call(xAxis)
          .selectAll("text")
         .style("text-anchor", "end")
  .style("font-weight", "bold")
  .attr("dx", "-.7em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-65)" )
        .selectAll("g")
          .delay(delay);
    }
    $("#thermal").hide(0).delay(500).fadeIn(3000);
 	         
    });
	}
   } ]);



genControllers.controller('nuclearConsumptionCtrl', [ '$scope','Record1','$location',
                                            		'$http',function($scope,Record1,$location,$http) {
                                                     

	  var maxYear=null;
		var minYear=null;
		
		
		$http.get("../consumptions").then(function(response){var data3=response.data;
		maxYear=d3.max(data3,function(d){return d.consYear;});
		minYear=d3.min(data3,function(d){return d.consYear;});
		$scope.value = "2013";
		$scope.options = {       
		  from: minYear,
		  to: maxYear,
		  step: 1,
		  dimension: " Year",
		  
		};
		buildChart();
		});
	   var c=0;
		
	   var margin = {top: 30, right: 10, bottom: 150, left: 40},
	   width = 1000 - margin.left - margin.right,
	   height = 600 - margin.top - margin.bottom;

	var h= document.createElement('h3');
	h.innerHTML='Nuclear Consumption Year Wise';
	document.getElementById("header").appendChild(h);
	$scope.sliderChange=function()
	{document.getElementById("thermal_check").checked=false;
		buildChart();
	};
	   
		function buildChart()
		{
		
	 if(c!=0)
		 {
		 document.getElementById("thermal").innerHTML="";
	 document.getElementById("legend").innerHTML="";
		 }

		 c++;

	  
	  
	  
	  
	  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

	  var y = d3.scale.linear().range([height, 0]);
	  
	  var xAxis = d3.svg.axis()
	      .scale(x)
	      .orient("bottom")
	      .tickSize(0);

	  var yAxis = d3.svg.axis()
	      .scale(y)
	      .orient("left")
	      .ticks(10);

	  var svg = d3.select("#thermal").append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	      .attr("transform", 
	            "translate(" + margin.left + "," + margin.top + ")");
	  
	  var div = d3.select("#thermal").append("div")   
	  .attr("class", "tooltip")               
	  .style("opacity", 0)
	  ;

	  d3.json("../consumptions?find=ByConsYear&consYear="+$scope.value, function(error, data) {

              data.forEach(function(d) {
              
                  d.nuclear=+d.nuclear;
                  d.nuclear=+d.nuclear;
                  d.thermal = +d.thermal;
              });
            var barwidth=width/data.length;
            x.domain(data.map(function(d) { return d.stateName; }));
            y.domain([0, d3.max(data, function(d) { return d.nuclear; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              .selectAll("text")
                 .style("text-anchor", "end")
  .style("font-weight", "bold")
  .attr("dx", "-.7em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-65)" );
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");
                
            
            svg.selectAll("bar")
                .data(data)
              .enter().append("rect")
                .style("fill", "#cca300")
                .attr("x", function(d) { return x(d.stateName); })
                .attr("width", barwidth-2)
                .attr("y", function(d) { return y(d.nuclear); })
                .attr("height", function(d) { return height - y(d.nuclear); })
                .on('mouseover',function(d){
               	 var state=d.stateName;
               	 if(state=="Andhra Pradesh")
               		 state="Andhra";
               	 if(state=="MADHYA PRADESH")
               		 state="M.P.";
               	 if(state=="UTTAR PRADESH")
               		 state="U.P.";
               	 if(state=="JAMMU AND KASHMIR")
               		 state="J&K";
               	 if(state=="ARUNACHAL PRADESH")
               		 state="Arunachal";
                   d3.select(this)
                    .transition()  
                 .duration(200)
                    .attr("x", function(d) { return x(d.stateName)+1; })
                .attr("width", barwidth+2)
                .attr("y", function(d) { return y(d.nuclear)-10; })
                .attr("height", function(d) { return height - y(d.nuclear)+10; })
                   .style('fill','#ffff43');
                   div.transition()        
                   .duration(200)      
                   .style("opacity", .9);      
               div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Nuclear:</strong> <span style='color:steelblue;font-weight:bold'>" + d.nuclear + "</span>")  
                   .style("left", (d3.event.pageX-205) + "px")     
                   .style("top", (d3.event.pageY-105) + "px");
                    
              })
              .on('mouseout',function(d){
             	
                 d3.select(this)
                 .transition()  
                 .duration(500)
                  .attr("x", function(d) { return x(d.stateName); })
                .attr("width", barwidth-2)
                .attr("y", function(d) { return y(d.nuclear); })
                .attr("height", function(d) { return height - y(d.nuclear); })
                   .style('fill','#cca300');
                 div.transition()        
                 .duration(500)      
                 .style("opacity", 0);
                 });
            
            d3.select("input#thermal_check").on("change", change);
           
            var sortTimeout = setTimeout(function() {
              d3.select("input").on("change",change);
            },750);

            function change() {
              clearTimeout(sortTimeout);
            var x0 = x.domain(data.sort(this.checked
                  ? function(a, b) {return b.nuclear - a.nuclear;}
                  : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
                  .map(function(d) { return d.stateName; }))
                  .copy();

              var transition = svg.transition().duration(750),
                  delay = function(d, i) { return i * 50; };

              transition.selectAll("rect")
                  .delay(delay)
                  .attr("x", function(d) { return x0(d.stateName); });

              transition.select(".x.axis")
                  .call(xAxis)
                  .selectAll("text")
               .style("text-anchor", "end")
  .style("font-weight", "bold")
  .attr("dx", "-.7em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-65)" )
                .selectAll("g")
                  .delay(delay);
            }
           
            $("#thermal").hide(0).delay(500).fadeIn(3000);         
            });
		}
          
 } ]);


 genControllers.controller('nuclearGenerationCtrl', [ '$scope','Record1','$location',
                                                      		'$http',function($scope,Record1,$location,$http) {
                                                               

	  var maxYear=null;
		var minYear=null;
		
		
		$http.get("../consumptions").then(function(response){var data3=response.data;
		maxYear=d3.max(data3,function(d){return d.consYear;});
		minYear=d3.min(data3,function(d){return d.consYear;});
		$scope.value = "2013";
		$scope.options = {       
		  from: minYear,
		  to: maxYear,
		  step: 1,
		  dimension: " Year",
		  
		};
		buildChart();
		});
	   var c=0;
		
	   var margin = {top: 30, right: 10, bottom: 150, left: 40},
	   width = 1000 - margin.left - margin.right,
	   height = 600 - margin.top - margin.bottom;

	var h= document.createElement('h3');
	h.innerHTML='Nuclear Generation Year Wise';
	document.getElementById("header").appendChild(h);
	$scope.sliderChange=function()
	{document.getElementById("thermal_check").checked=false;
		buildChart();
	};
	   
		function buildChart()
		{
		
	 if(c!=0)
		 {
		 document.getElementById("thermal").innerHTML="";
	 document.getElementById("legend").innerHTML="";
		 }

		 c++;

	  
	  
	  
	  
	  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

	  var y = d3.scale.linear().range([height, 0]);
	  
	  var xAxis = d3.svg.axis()
	      .scale(x)
	      .orient("bottom")
	      .tickSize(0);

	  var yAxis = d3.svg.axis()
	      .scale(y)
	      .orient("left")
	      .ticks(10);

	  var svg = d3.select("#thermal").append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	      .attr("transform", 
	            "translate(" + margin.left + "," + margin.top + ")");
	  
	  var div = d3.select("#thermal").append("div")   
	  .attr("class", "tooltip")               
	  .style("opacity", 0)
	  ;

	  d3.json("../generations?find=ByGenYear&genYear="+$scope.value, function(error, data) {

                        data.forEach(function(d) {
                        
                            d.nuclear=+d.nuclear;
                            d.nuclear=+d.nuclear;
                            d.thermal = +d.thermal;
                        });
                      var barwidth=width/data.length;
                      x.domain(data.map(function(d) { return d.stateName; }));
                      y.domain([0, d3.max(data, function(d) { return d.nuclear; })]);

                      svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0," + height + ")")
                          .call(xAxis)
                        .selectAll("text")
                          .style("text-anchor", "end")
                          .style("font-weight", "bold")
                          .attr("dx", "-.7em")
                          .attr("dy", "-.55em")
                          .attr("transform", "rotate(-65)" );

                      svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                        .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 6)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end");
                          
                      
                      svg.selectAll("bar")
                          .data(data)
                        .enter().append("rect")
                          .style("fill", "#cca300")
                          .attr("x", function(d) { return x(d.stateName); })
                          .attr("width", barwidth-2)
                          .attr("y", function(d) { return y(d.nuclear); })
                          .attr("height", function(d) { return height - y(d.nuclear); })
                          .on('mouseover',function(d){
                         	 var state=d.stateName;
                         	 if(state=="Andhra Pradesh")
                         		 state="Andhra";
                         	 if(state=="MADHYA PRADESH")
                         		 state="M.P.";
                         	 if(state=="UTTAR PRADESH")
                         		 state="U.P.";
                         	 if(state=="JAMMU AND KASHMIR")
                         		 state="J&K";
                         	 if(state=="ARUNACHAL PRADESH")
                         		 state="Arunachal";
                             d3.select(this)
                              .transition() 
                           .duration(200)
                             .attr("x", function(d) { return x(d.stateName)+1; })
                          .attr("width", barwidth+2)
                          .attr("y", function(d) { return y(d.nuclear)-10; })
                          .attr("height", function(d) { return height - y(d.nuclear)+10; })
                             .style('fill','#ffff43');
                             div.transition()        
                             .duration(200)      
                             .style("opacity", .9);      
                         div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Nuclear:</strong> <span style='color:steelblue;font-weight:bold'>" + d.nuclear + "</span>")  
                             .style("left", (d3.event.pageX-205) + "px")     
                             .style("top", (d3.event.pageY-105) + "px");
                              
                    })
                        .on('mouseout',function(d){
                       	
                           d3.select(this)
                           .transition()  // adds a "smoothing" animation to the transition
                           .duration(500)
                           .attr("x", function(d) { return x(d.stateName); })
                          .attr("width", barwidth-2)
                          .attr("y", function(d) { return y(d.nuclear); })
                          .attr("height", function(d) { return height - y(d.nuclear); })
                             .style('fill','#cca300');
                           div.transition()        
                           .duration(500)      
                           .style("opacity", 0);
                           });
                      
                      d3.select("input#thermal_check").on("change", change);
                     
                      var sortTimeout = setTimeout(function() {
                        d3.select("input").on("change",change);
                      },750);

                      function change() {
                        clearTimeout(sortTimeout);

                         var x0 = x.domain(data.sort(this.checked
                            ? function(a, b) {return b.nuclear - a.nuclear;}
                            : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
                            .map(function(d) { return d.stateName; }))
                            .copy();

                        var transition = svg.transition().duration(750),
                            delay = function(d, i) { return i * 50; };

                        transition.selectAll("rect")
                            .delay(delay)
                            .attr("x", function(d) { return x0(d.stateName); });

                        transition.select(".x.axis")
                            .call(xAxis)
                            .selectAll("text")
                          .style("text-anchor", "end")
                          .style("font-weight", "bold")
                          .attr("dx", "-.7em")
                          .attr("dy", "-.55em")
                          .attr("transform", "rotate(-65)" )
                          .selectAll("g")
                            .delay(delay);
                      }
                     
                   	         
                      });
	  $("#thermal").hide(0).delay(500).fadeIn(3000);
		}
                    
           } ]);


          genControllers.controller('hydroGenerationCtrl', [ '$scope','Record1','$location',
                                                      		'$http',function($scope,Record1,$location,$http) {
                                                               

        	  var maxYear=null;
        		var minYear=null;
        		
        		$http.get("../consumptions").then(function(response){var data3=response.data;
        		maxYear=d3.max(data3,function(d){return d.consYear;});
        		minYear=d3.min(data3,function(d){return d.consYear;});
        		$scope.value = "2013";
        		$scope.options = {       
        		  from: minYear,
        		  to: maxYear,
        		  step: 1,
        		  dimension: " Year",
        		  
        		};
        		buildChart();
        		});
        	   var c=0;
        		
        	   var margin = {top: 30, right: 10, bottom: 150, left: 40},
        	   width = 1000 - margin.left - margin.right,
        	   height = 600 - margin.top - margin.bottom;

        	var h= document.createElement('h3');
        	h.innerHTML='Hydro Generation Year Wise';
        	document.getElementById("header").appendChild(h);
        	$scope.sliderChange=function()
        	{document.getElementById("thermal_check").checked=false;
        		buildChart();
        	};
        	   
        		function buildChart()
        		{
        		
        	 if(c!=0)
        		 {
        		 document.getElementById("thermal").innerHTML="";
        	 document.getElementById("legend").innerHTML="";
        		 }

        		 c++;

        	  
        	  
        	  
        	  
        	  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

        	  var y = d3.scale.linear().range([height, 0]);
        	  
        	  var xAxis = d3.svg.axis()
        	      .scale(x)
        	      .orient("bottom")
        	      .tickSize(0);

        	  var yAxis = d3.svg.axis()
        	      .scale(y)
        	      .orient("left")
        	      .ticks(10);

        	  var svg = d3.select("#thermal").append("svg")
        	      .attr("width", width + margin.left + margin.right)
        	      .attr("height", height + margin.top + margin.bottom)
        	    .append("g")
        	      .attr("transform", 
        	            "translate(" + margin.left + "," + margin.top + ")");
        	  
        	  var div = d3.select("#thermal").append("div")   
        	  .attr("class", "tooltip")               
        	  .style("opacity", 0)
        	  ;

        	  d3.json("../generations?find=ByGenYear&genYear="+$scope.value, function(error, data) {

                        data.forEach(function(d) {
                        
                            d.hydro=+d.hydro;
                            d.nuclear=+d.nuclear;
                            d.thermal = +d.thermal;
                        });
                     var barwidth=width/data.length;
                      x.domain(data.map(function(d) { return d.stateName; }));
                      y.domain([0, d3.max(data, function(d) { return d.hydro; })]);

                      svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0," + height + ")")
                          .call(xAxis)
                        .selectAll("text")
                           .style("text-anchor", "end")
                         .style("font-weight", "bold")
                         .attr("dx", "-.7em")
                         .attr("dy", "-.55em")
                          .attr("transform", "rotate(-65)" );
                      svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                        .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 6)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end");
                          
                      
                      svg.selectAll("bar")
                          .data(data)
                        .enter().append("rect")
                          .style("fill", "#990400")
                          .attr("x", function(d) { return x(d.stateName); })
                          .attr("width", barwidth-2)
                          .attr("y", function(d) { return y(d.hydro); })
                          .attr("height", function(d) { return height - y(d.hydro); })
                          .on('mouseover',function(d){
                         	 var state=d.stateName;
                         	 if(state=="Andhra Pradesh")
                         		 state="Andhra";
                         	 if(state=="MADHYA PRADESH")
                         		 state="M.P.";
                         	 if(state=="UTTAR PRADESH")
                         		 state="U.P.";
                         	 if(state=="JAMMU AND KASHMIR")
                         		 state="J&K";
                         	 if(state=="ARUNACHAL PRADESH")
                         		 state="Arunachal";
                             d3.select(this)
                             .transition()  // adds a "smoothing" animation to the transition
                           .duration(200)
                              .attr("x", function(d) { return x(d.stateName)+1; })
                          .attr("width", barwidth+2)
                          .attr("y", function(d) { return y(d.hydro)-10; })
                          .attr("height", function(d) { return height - y(d.hydro)+10; })
                             .style('fill','red');
                             div.transition()        
                             .duration(200)      
                             .style("opacity", .9);      
                         div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Hydro:</strong> <span style='color:steelblue;font-weight:bold'>" + d.hydro + "</span>")  
                             .style("left", (d3.event.pageX-205) + "px")     
                             .style("top", (d3.event.pageY-105) + "px");
                              
                      })
                        .on('mouseout',function(d){
                       	
                           d3.select(this)
                           .transition() 
                           .duration(500)
                            .attr("x", function(d) { return x(d.stateName); })
                          .attr("width", barwidth-2)
                          .attr("y", function(d) { return y(d.hydro); })
                          .attr("height", function(d) { return height - y(d.hydro); })
                             .style('fill','#990400');
                           div.transition()        
                           .duration(500)      
                           .style("opacity", 0);
                           });
                      
                      d3.select("input#thermal_check").on("change", change);
                     
                      var sortTimeout = setTimeout(function() {
                        d3.select("input").on("change",change);
                      },750);

                      function change() {
                        clearTimeout(sortTimeout);

                        var x0 = x.domain(data.sort(this.checked
                            ? function(a, b) {return b.hydro - a.hydro;}
                            : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
                            .map(function(d) { return d.stateName; }))
                            .copy();

                        var transition = svg.transition().duration(750),
                            delay = function(d, i) { return i * 50; };

                        transition.selectAll("rect")
                            .delay(delay)
                            .attr("x", function(d) { return x0(d.stateName); });

                        transition.select(".x.axis")
                            .call(xAxis)
                            .selectAll("text")
                           .style("text-anchor", "end")
                           .style("font-weight", "bold")
                           .attr("dx", "-.7em")
                           .attr("dy", "-.55em")
                           .attr("transform", "rotate(-65)" )
                          .selectAll("g")
                            .delay(delay);
                      }
                     
                   	         
                      });
        	  $("#thermal").hide(0).delay(500).fadeIn(3000);
        		}
                  } ]);
          
          
          
          
          
          genControllers.controller('consumptionGenerationCtrl', [ '$scope','Record1','$location',
                                                         		'$http',function($scope,Record1,$location,$http) {
                                    
        	    var maxYear=null;
        		var minYear=null;
        		
        		
        		  var c=0;
        		 var margin = {top: 30, right: 10, bottom: 150, left: 50},
                 width = 1800 - margin.left - margin.right,
                 height = 600 - margin.top - margin.bottom;

             // Parse the date / time
             var h= document.createElement('h3');
             h.innerHTML='Statewise Consumption-Generation Chart';
            document.getElementById("header").appendChild(h);
            document.getElementById("thermal").innerHTML="";
        		$http.get("../consumptions").then(function(response){var data3=response.data;
        		maxYear=d3.max(data3,function(d){return d.consYear;});
        		minYear=d3.min(data3,function(d){return d.consYear;});
        		$scope.value = "2013";
        		$scope.options = {       
        		  from: minYear,
        		  to: maxYear,
        		  step: 1,
        		  dimension: " Year",
        		  
        		};
        		buildChart();
        		});
        	   
        	   
        	    $scope.sliderChange=function()
        	     {document.getElementById("thermal_check").checked=false;
        	    	buildChart();
        	     };
        	  
                      function buildChart()
                      { //var sortData=null;
                    	  if(c!=0)
                 		 {
                     	 document.getElementById("thermal").innerHTML="";
                 	     document.getElementById("legend").innerHTML="";
                 		 }
                    	  c++;
                       var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);

                       var y = d3.scale.linear().range([height, 0]);
                       
                       var xAxis = d3.svg.axis()
                           .scale(x)
                           .orient("bottom")
                           .tickSize(20);

                       var yAxis = d3.svg.axis()
                           .scale(y)
                           .orient("left")
                           .ticks(25);

                       var svg = d3.select("#thermal").append("svg")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                         .append("g")
                           .attr("transform", 
                                 "translate(" + margin.left + "," + margin.top + ")");
                      
                      
                    
                                            
                       var div = d3.select("#thermal").append("div")   
                       .attr("class", "tooltip")               
                       .style("opacity", 0);
                       var dataConsuption=null;
                       var maxYValue=null;
                       
                       d3.json("../consumptions?find=ByConsYear&consYear="+$scope.value, function(error, data1) {				// Go to the data folder (in the current directory) and read in the data.tsv file
                    		data1.forEach(function(d) {								// For all the data values carry out the following
                    			d.stateName=d.stateName;
                    			d.thermal=+d.thermal;
                    			d.nuclear=+d.nuclear;
                    			d.hydro=+d.hydro;// makesure d.data is a number, not a string
                    		});
                    		dataConsuption=data1;
                    		d3.json("../generations?find=ByGenYear&genYear="+$scope.value, function(error, data) {
                                
                                data.forEach(function(d) {
                             	   
                              
                                    d.hydro=+d.hydro;
                                    d.nuclear=+d.nuclear;
                                    d.thermal = +d.thermal;
                               
                                });
                                

                                var maxYValueGeneration=d3.max(data, function(d) { return d.thermal+d.hydro+d.nuclear; });
                            	var maxYValueConsuption=d3.max(dataConsuption, function(d) { return d.thermal+d.hydro+d.nuclear; });
                                 maxYValue=d3.max([maxYValueGeneration,maxYValueConsuption]);
                                
                                var barwidth=(width-800)/data.length;
                              x.domain(data.map(function(d) { return d.stateName; }));
                              y.domain([0,maxYValue]);

                              svg.append("g")
                                  .attr("class", "x axis")
                                  .attr("transform", "translate(0," + height + ")")
                                  .call(xAxis)
                                .selectAll("text")
                                  .style("text-anchor", "end")
                                  .style("font-size",15)
                                  .attr("dx", "-0.5em")
                                  .attr("dy", "-2em")
                                  .attr("transform", "rotate(-65)" );

                              svg.append("g")
                                  .attr("class", "y axis")
                                  .call(yAxis)
                                .append("text")
                                  .attr("transform", "rotate(-90)")
                                  .attr("y", 6)
                                  .attr("dy", ".71em")
                                  .style("text-anchor", "end");
                                  
                              
                              svg.selectAll("bar")
                                  .data(data)
                                .enter().append("rect")
                                  .style("fill", "steelblue")
                                  .attr("x", function(d) { return x(d.stateName)+2; })
                                  .attr("width", barwidth-6)
                                  .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
                                  .attr("height", function(d) { return height - y(d.thermal+d.nuclear+d.hydro); })
                                  .on('mouseover',function(d){
                                 	 var state=d.stateName;
                                 	
                                 	 if(state=="Andhra Pradesh")
                                 		 state="Andhra";
                                 	 if(state=="MADHYA PRADESH")
                                 		 state="M.P.";
                                 	 if(state=="UTTAR PRADESH")
                                 		 state="U.P.";
                                 	 if(state=="JAMMU AND KASHMIR")
                                 		 state="J&K";
                                 	 if(state=="ARUNACHAL PRADESH")
                                 		 state="Arunachal";
                                     d3.select(this)
                                     .transition()  // adds a "smoothing" animation to the transition
                                   .duration(200)
                                      .attr("x", function(d) { return x(d.stateName)+3; })
                                  .attr("width", barwidth+6)
                                  .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear)-10; })
                                  .attr("height", function(d) { return height - y(d.thermal+d.nuclear+d.hydro)+10; })
                                     .style('fill','#008cff');
                                    
                                     div.transition()        
                                     .duration(200)      
                                     .style("opacity", .9);
                                     
                                 div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Generation:</strong> <span style='color:steelblue;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) +"</span>")  
                                     .style("left", (d3.event.pageX-205) + "px")     
                                     .style("top", (d3.event.pageY-105) + "px");
                                    
                                   })
                                .on('mouseout',function(d){
                               	
                                   d3.select(this)
                                   .transition()  // adds a "smoothing" animation to the transition
                                   .duration(500)
                                    .attr("x", function(d) { return x(d.stateName)+2; })
                                  .attr("width", barwidth-6)
                                  .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
                                  .attr("height", function(d) { return height - y(d.thermal+d.nuclear+d.hydro); })
                                     .style('fill','steelblue')
                                      ;
                                   div.transition()        
                                   .duration(500)      
                                   .style("opacity", 0);
                                   });
                              
                            
                              svg.selectAll("bar")
                              .data(dataConsuption)
                               .enter().append("rect")
                              .style("fill", "#990400")
                              .attr("x", function(d) { return x(d.stateName)-20; })
                              .attr("width", barwidth-6)
                              .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
                              .attr("height", function(d) { return height - y(d.thermal+d.hydro+d.nuclear); })
                              .on('mouseover',function(d){
                             	 var state=d.stateName;
                             	 if(state=="Andhra Pradesh")
                             		 state="Andhra";
                             	 if(state=="MADHYA PRADESH")
                             		 state="M.P.";
                             	 if(state=="UTTAR PRADESH")
                             		 state="U.P.";
                             	 if(state=="JAMMU AND KASHMIR")
                             		 state="J&K";
                             	 if(state=="ARUNACHAL PRADESH")
                             		 state="Arunachal";
                                 d3.select(this)
                                  .transition()  // adds a "smoothing" animation to the transition
                               .duration(300)
                                  .attr("x", function(d) { return x(d.stateName)-20+1; })
                              .attr("width", barwidth+6)
                              .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear)-10; })
                              .attr("height", function(d) { return height - y(d.thermal+d.hydro+d.nuclear)+10; })
                                 .style('fill','red');
                                 div.transition()        
                                 .duration(200)      
                                 .style("opacity", .9);      
                             div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Consumption:</strong> <span style='color:red;font-weight:bold'>" + (d.thermal+d.hydro+d.nuclear).toFixed(3) + "</span>")  
                                 .style("left", (d3.event.pageX-205) + "px")     
                                 .style("top", (d3.event.pageY-105) + "px");
                                
                               })
                            .on('mouseout',function(d){
                           	
                               d3.select(this)
                               .transition()  // adds a "smoothing" animation to the transition
                               .duration(500)
                                .attr("x", function(d) { return x(d.stateName)-20; })
                              .attr("width", barwidth-6)
                              .attr("y", function(d) { return y(d.thermal+d.hydro+d.nuclear); })
                              .attr("height", function(d) { return height - y(d.thermal+d.hydro+d.nuclear); })
                                 .style('fill','#990400');
                               div.transition()        
                               .duration(500)      
                               .style("opacity", 0);
                               });
                              
                              var svg1 = d3.select("#legend").append("svg")
                              .attr("width",300)
                              .attr("height",30);
                              var legend = svg1.append("g");
                              
                              

                              legend.selectAll('g').data(data)
                                .enter()
                                .append('g')
                                .append("rect")
                                    .attr("x", 30)
                                    .attr("y", 2)
                                    .attr("width", 21)
                                    .attr("height", 21)
                                    .style("fill","blue");


                              svg1.append('text').text('GENERATION')
                              .attr('x', 55)
                              .attr('y', 19)
                              .attr('fill', 'black')  ;  
                                  
                              var legend = svg1.append("g");

                              legend.selectAll('g').data(data)
                              .enter()
                              .append('g')
                              .append("rect")
                                  .attr("x", 160)
                                  .attr("y", 2)
                                  .attr("width", 21)
                                  .attr("height", 21)
                                  .style("fill","red");


                              svg1.append('text').text('CONSUMPTION')
                              .attr('x',188 )
                              .attr('y', 19)
                              .attr('fill', 'black')  ; 
                              
                          });

                    	
                    	});

                                              $("#thermal").hide(0).delay(500).fadeIn(3000);
                      }
                     
                       
} ]);
          
          genControllers.controller('thermalGenerationCtrl', [ '$scope','Record1','$location',
                                                         		'$http',function($scope,Record1,$location,$http) {

        	  var maxYear=null;
        		var minYear=null;
        	
        		  var c=0;
          		
           	   var margin = {top: 30, right: 10, bottom: 150, left: 40},
           	   width = 1000 - margin.left - margin.right,
           	   height = 600 - margin.top - margin.bottom;

           	var h= document.createElement('h3');
           	h.innerHTML='Thermal Generation Year Wise';
           	document.getElementById("header").appendChild(h);
        		
        		$http.get("../consumptions").then(function(response){var data3=response.data;
        		maxYear=d3.max(data3,function(d){return d.consYear;});
        		minYear=d3.min(data3,function(d){return d.consYear;});
        		$scope.value = "2013";
        		$scope.options = {       
        		  from: minYear,
        		  to: maxYear,
        		  step: 1,
        		  dimension: " Year",
        		  
        		};
        		buildChart();
        		});
        	 
        	$scope.sliderChange=function()
        	{document.getElementById("thermal_check").checked=false;
        		buildChart();
        	};
        	   
        		function buildChart()
        		{
        		
        	 if(c!=0)
        		 {
        		 document.getElementById("thermal").innerHTML="";
        	 document.getElementById("legend").innerHTML="";
        		 }

        		 c++;
              var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
              var y = d3.scale.linear().range([height, 0]);
        	  var xAxis = d3.svg.axis()
        	      .scale(x)
        	      .orient("bottom")
        	      .tickSize(0);
              var yAxis = d3.svg.axis()
        	      .scale(y)
        	      .orient("left")
        	      .ticks(10);

        	  var svg = d3.select("#thermal").append("svg")
        	      .attr("width", width + margin.left + margin.right)
        	      .attr("height", height + margin.top + margin.bottom)
        	    .append("g")
        	      .attr("transform", 
        	            "translate(" + margin.left + "," + margin.top + ")");
        	  
        	  var div = d3.select("#thermal").append("div")   
        	  .attr("class", "tooltip")               
        	  .style("opacity", 0)
        	  ;

        	  d3.json("../generations?find=ByGenYear&genYear="+$scope.value, function(error, data) {
                           data.forEach(function(d) {
                           
                               d.hydro=+d.hydro;
                               d.nuclear=+d.nuclear;
                               d.thermal = +d.thermal;
                           });
                           var barwidth=width/data.length;
                         x.domain(data.map(function(d) { return d.stateName; }));
                         y.domain([0, d3.max(data, function(d) { return d.thermal; })]);

                         svg.append("g")
                             .attr("class", "x axis")
                             .attr("transform", "translate(0," + height + ")")
                             .call(xAxis)
                           .selectAll("text")
                             .style("text-anchor", "end")
                            .style("font-weight", "bold")
                            .attr("dx", "-.7em")
                            .attr("dy", "-.55em")
                            .attr("transform", "rotate(-65)" );

                         svg.append("g")
                             .attr("class", "y axis")
                             .call(yAxis)
                           .append("text")
                             .attr("transform", "rotate(-90)")
                             .attr("y", 6)
                             .attr("dy", ".71em")
                             .style("text-anchor", "end");
                             
                         
                         svg.selectAll("bar")
                             .data(data)
                           .enter().append("rect")
                             .style("fill", "steelblue")
                             .attr("x", function(d) { return x(d.stateName); })
                             .attr("width", barwidth-2)
                             .attr("y", function(d) { return y(d.thermal); })
                             .attr("height", function(d) { return height - y(d.thermal); })
                             .on('mouseover',function(d){
                            	 var state=d.stateName;
                            	 if(state=="Andhra Pradesh")
                            		 state="Andhra";
                            	 if(state=="MADHYA PRADESH")
                            		 state="M.P.";
                            	 if(state=="UTTAR PRADESH")
                            		 state="U.P.";
                            	 if(state=="JAMMU AND KASHMIR")
                            		 state="J&K";
                            	 if(state=="ARUNACHAL PRADESH")
                            		 state="Arunachal";
                                d3.select(this)
                                .transition()  // adds a "smoothing" animation to the transition
                              .duration(300)
                                  .attr("x", function(d) { return x(d.stateName)+1; })
                             .attr("width", barwidth+2)
                             .attr("y", function(d) { return y(d.thermal)-10; })
                             .attr("height", function(d) { return height - y(d.thermal)+10; })
                                .style('fill','#008cff');
                                div.transition()        
                                .duration(200)      
                                .style("opacity", .9);      
                            div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>" + state + "</span> <strong>Thermal:</strong> <span style='color:steelblue;font-weight:bold'>" + d.thermal + "</span>")  
                                .style("left", (d3.event.pageX-205) + "px")     
                                .style("top", (d3.event.pageY-105) + "px");
                                 
                              
                              
                             
                                
                               })
                           .on('mouseout',function(d){
                          	
                              d3.select(this)
                              .transition()  // adds a "smoothing" animation to the transition
                              .duration(500)
                                .attr("x", function(d) { return x(d.stateName); })
                             .attr("width", barwidth-2)
                             .attr("y", function(d) { return y(d.thermal); })
                             .attr("height", function(d) { return height - y(d.thermal); })
                                .style('fill','steelblue');
                              div.transition()        
                              .duration(500)      
                              .style("opacity", 0);
                              });
                         
                         d3.select("input#thermal_check").on("change", change);
                        
                         var sortTimeout = setTimeout(function() {
                           d3.select("input").on("change",change);
                         },750);

                         function change() {
                           clearTimeout(sortTimeout);

                           // Copy-on-write since tweens are evaluated after a delay.
                           
                           var x0 = x.domain(data.sort(this.checked
                               ? function(a, b) {return b.thermal - a.thermal;}
                               : function(a, b) { return d3.ascending(a.stateName, b.stateName); })
                               .map(function(d) { return d.stateName; }))
                               .copy();

                           var transition = svg.transition().duration(750),
                               delay = function(d, i) { return i * 50; };

                           transition.selectAll("rect")
                               .delay(delay)
                               .attr("x", function(d) { return x0(d.stateName); });

                           transition.select(".x.axis")
                               .call(xAxis)
                               .selectAll("text")
                             .style("text-anchor", "end")
                            .style("font-weight", "bold")
                              .attr("dx", "-.7em")
                           .attr("dy", "-.55em")
                           .attr("transform", "rotate(-65)" )
                             .selectAll("g")
                               .delay(delay);
                         }
                        
                             
                         });
        	  $("#thermal").hide(0).delay(500).fadeIn(3000); 
        		}
                       
} ]);
          
genControllers.controller('lineCtrl', [ '$scope','Record1','Record2','$location',
                                            		'$http',function($scope,Record1,Record2,$location,$http) {
	
	var	margin = {top: 30, right: 20, bottom: 80, left: 50},	// sets the width of the margins around the actual graph area
	width = 1100 - margin.left - margin.right,				// sets the width of the graph area
	height = 600 - margin.top - margin.bottom;				// sets the height of the graph area


// Set the ranges
	  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
		// scales the range of values on the x axis to fit between 0 and 'width'
var	y = d3.scale.linear().range([height, 0]);				// scales the range of values on the y axis to fit between 'height' and 0

// Define the axes
var	xAxis = d3.svg.axis().scale(x)							// defines the x axis function and applies the scale for the x dimension
	.orient("bottom").ticks(0);								// tells what side the ticks are on and how many to put on the axis

function xx(e) { return x(e.stateName); };
function yy(e) { return y(e.thermal+e.hydro+e.nuclear); };


var	yAxis = d3.svg.axis().scale(y)							// defines the y axis function and applies the scale for the y dimension
	.orient("left").ticks(10);								// tells what side the ticks are on and how many to put on the axis




var div = d3.select("#thermal").append("div")   
.attr("class", "tooltip")               
.style("opacity", 0)
;
// Define the line
var	valueline = d3.svg.line()								// set 'valueline' to be a line
	.x(function(d) { return x(d.stateName); })					// set the x coordinates for valueline to be the d.date values
	.y(function(d) { return y(d.thermal+d.hydro+d.nuclear); });					// set the y coordinates for valueline to be the d.close values

// Adds the svg canvas
var	svg = d3.select("#thermal")									// Explicitly state where the svg element will go on the web page (the 'body')
	.append("svg")											// Append 'svg' to the html 'body' of the web page
		.attr("width", width + margin.left + margin.right)	// Set the 'width' of the svg element
		.attr("height", height + margin.top + margin.bottom)// Set the 'height' of the svg element
	.append("g")											// Append 'g' to the html 'body' of the web page
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // in a place that is the actual area for the graph

var dataConsuption;
var maxYValue;

d3.json("../consumptions", function(error, data1) {				// Go to the data folder (in the current directory) and read in the data.tsv file
	data1.forEach(function(d) {								// For all the data values carry out the following
		d.stateName=d.stateName;
		d.thermal=+d.thermal;
		d.nuclear=+d.nuclear;
		d.hydro=+d.hydro;// makesure d.close is a number, not a string
	});
	dataConsuption=data1;
});

// Get the data
d3.json("../generations", function(error, data) {
	// Go to the data folder (in the current directory) and read in the data.tsv file
	data.forEach(function(d) {								// For all the data values carry out the following
		d.stateName=d.stateName;
		d.thermal=+d.thermal;
		d.nuclear=+d.nuclear;
		d.hydro=+d.hydro;// makesure d.close is a number, not a string
	});
	
	var maxYValueGeneration=d3.max(data, function(d) { return d.thermal+d.hydro+d.nuclear; });
	var maxYValueConsuption=d3.max(dataConsuption, function(d) { return d.thermal+d.hydro+d.nuclear; });
     maxYValue=d3.max([maxYValueGeneration,maxYValueConsuption]);
     
    
	// Scale the range of the data
	 x.domain(data.map(function(d) { return d.stateName; }));		// set the x domain so be as wide as the range of dates we have.
	y.domain([0,maxYValue ]);	// set the y domain to go from 0 to the maximum value of d.close

	// Add the valueline path.
	svg.append("path")	
	    .data(data)
		.attr("class", "line")								// apply the 'line' CSS styles to this path
		.attr("d", valueline(data));
	
	svg.selectAll(".point")
    .data(data)
  .enter().append("path")
    .attr("class", "point")
    .attr("fill", "steelblue")
    .attr("d", d3.svg.symbol().type("triangle-up"))
    .attr("transform", function(d) { return "translate(" + x(d.stateName) + "," + y(d.thermal+d.nuclear+d.hydro) + ")"; })
	/*svg
	 .selectAll("circle")
	 .data(data)
	 .enter().append("circle")
	 .attr("fill", "steelblue")
	 .attr("r", 5)
	 .attr("cx", xx)
	 .attr("cy", yy)*/
	 .on("mouseover", function(d) { showData(this, d);})
	 .on("mouseout", function(){ hideData();});// call the 'valueline' finction to draw the line

	// Add the X Axis
	svg.append("g")											// append the x axis to the 'g' (grouping) element
		.attr("class", "x axis")							// apply the 'axis' CSS styles to this path
		.attr("transform", "translate(0," + height + ")")	// move the drawing point to 0,height
		.call(xAxis)
		.selectAll("text")
        .style("text-anchor", "end")
        .style("font-size",10)
        .attr("dx", "-.5em")
        .attr("dy", "-.4em")
       .attr("transform", "rotate(-65)" );// call the xAxis function to draw the axis

	// Add the Y Axis
	svg.append("g")											// append the y axis to the 'g' (grouping) element
		.attr("class", "y axis")							// apply the 'axis' CSS styles to this path
		.call(yAxis);	
	// call the yAxis function to draw the axis
	//Drawing consuption graph with dataConsuption
	 x.domain(dataConsuption.map(function(d) { return d.stateName; }));		// set the x domain so be as wide as the range of dates we have.
		y.domain([0, maxYValue]);	
	
		
		svg.append("path")      // Add the valueline2 path.
	 .attr("class", "line")
	 .style("stroke", "red")
	 .attr("d", valueline(dataConsuption));
	svg
	 .selectAll("circle")
	 .data(dataConsuption)
	 .enter().append("circle")
	 .attr("fill", "red")
	 .attr("r", 5)
	 .attr("cx", xx)
	 .attr("cy", yy)
	 .on("mouseover", function(d) { showData(this, d);})
	 .on("mouseout", function(){ hideData();});

});


	

function showData(obj, d) {
	
	 var state=d.stateName;
	 if(state=="ANDHRA PRADESH")
		 state="ANDHRA";
	 if(state=="MADHYA PRADESH")
		 state="M.P.";
	 if(state=="UTTAR PRADESH")
		 state="U.P.";
	 if(state=="JAMMU AND KASHMIR")
		 state="J&K";
	 if(state=="ARUNACHAL PRADESH")
		 state="Arunachal";
	 
	 var total=d.thermal+d.hydro+d.nuclear;
	 total=total.toFixed(3);
	 div.transition()        
     .duration(200)      
     .style("opacity", .9);      
 div .html( "<strong>State:</strong> <span style='color:#66ccff;font-weight:bold'>"+state+ "</span> <strong>Total:</strong> <span style='color:steelblue;font-weight:bold'>" + total + "</span>")  
     .style("left", (d3.event.pageX-205) + "px")     
     .style("top", (d3.event.pageY-105) + "px");
      
   
	 }
	 
	function hideData() {
		d3.select(this)
        .transition()  // adds a "smoothing" animation to the transition
        .duration(500)
          .style('fill','steelblue');
        div.transition()        
        .duration(500)      
        .style("opacity", 0);
	}
                                            		 
 } ]);    


