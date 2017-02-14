"use strict";

function canvasSupport() {
  return !!document.createElement('canvas').getContext;
} 


function canvasApp() {

    var N = 150;// number of elements to sort
    var delay = 100;

    var randomized = false;
 
    var values = [];// values to be sorted

    function Sorter(values) {
   
        this.values = values;
        this.aux = [];

        this.results = [];
      
        this.swapCount = 0;
        this.count = 0;

        this.mLength = values.length;

        this.swap = function(i, j) {// swap aux[i] and aux[j], not i an j
            var temp = this.values[i];
            this.values[i] = this.values[j];
            this.values[j] = temp;
        };// swap

        this.partition = function(p, r) {
            var temp = this.values[r];
            var i = p;

            for (var j = p; j < r; j++) {
                if (this.values[j] <= temp) {
                    i++;
                    this.swap(i-1, j);
                    this.results.push(this.values.slice(0));// save copy for animation after each swap
                    this.swapCount++;
                }
                this.count++;
            }
            this.swap(i, r);
            this.results.push(this.values.slice(0));// save copy for animation after each swap
            this.swapCount++;
          
            return i; 
        };// partition

        // main method, non recursive quicksort implementation, using explicit stack
        this.quickSort = function() {    
            var stack = [];

            this.swapCount = 0;
            this.count = 0;

            var p, q, r, top;

            stack.push([0, this.mLength-1]);
           
            // main loop
            while (stack.length > 0) {         
                top = stack.pop();
                p = top[0];
                r = top[1];
                
                q = this.partition(p, r);        

                // push on stack
                if (q > 0 && p < q-1) {                        
                    stack.push([p, q-1]);
                }

                if (r < this.mLength && q+1 < r) {                        
                    stack.push([q+1, r]);
                }
                 
            }

            this.results.push(this.values.slice(0));// save copy for animation
        };// quickSort
 
    }// Sorter

    function initGeometry() {
        var deltaX = (xMax - 20) / N;

        for (var i = 0; i < N; i++) {
            xPos.push(10 + i * deltaX);
        }
    }// initGeometry


    function fillBackground() {
        // draw background
        context.fillStyle = '#ffffff';
        context.fillRect(xMin, yMin, xMax, yMax);    
    }// fillBackground

    function drawValues(values) {
        fillBackground();
        for (var i = 0; i < values.length; i++) {
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = 2;
            context.moveTo(xPos[i], yMax);
            context.lineTo(xPos[i], yMax - values[i]);
            context.stroke();
            context.closePath();
        }
    }// drawValues

    if (!canvasSupport()) {
        return;
    } else {
        var theCanvas = $('#canvas')[0];
        var context = theCanvas.getContext("2d");
    }

    var xMin = 0;
    var yMin = 0;
    var xMax = theCanvas.width;
    var yMax = theCanvas.height;

    var xPos = [];
  
    function init(values) {
    
        fillBackground();
        
	drawValues(values)	

        $('#stanim').find(':submit')[0].disabled = false;
        $('#initelem').find(':submit')[0].disabled = false;
   
    }// init
  
    function randomize() {   
        var val;
        var more;

        var values = [];

        for (var i = 0; i < N; i++) {
              more = true;// flag
              while(more) {
                more = false;
                val = Math.floor(Math.random() * 500 + 20);
                for (var j = 0; j < values.length; j++) {
                      if (val == values[j]) {// value already present
                           more = true;
                         break;
                      } 
                }           
              }
              values[i] = val;    
        }
     
        randomized = true;
        init(values);
    
        return values;  
    }// randomize

    $('#initelem').submit(function(event) { randomize(); return false; } );

    $('#stanim').submit(function(event) { 
        startAnim(); 
        $('#stanim').find(':submit')[0].disabled = true; 
        $('#initelem').find(':submit')[0].disabled = true;  
        return false; 
    });

    function startAnim() {// this is an event handler  
        var sorter = new Sorter(values);

        sorter.quickSort();

        display(sorter.results, sorter.count, sorter.swapCount);
    }
  
    function display(results, count, swapCount) {
        // display number of comparisdons
        $('#countDisp').text(count);

        // display number of swaps
        $('#swapCountDisp').text(swapCount);
        
        // initialize
        var iAnim = 0;
        var temp = [];

        function act() {               
            temp = results[iAnim];

	    drawValues(temp);
        
            // schedule next step
            if (iAnim < results.length-1) {
              iAnim++;
              setTimeout(act, delay);
            } else {// animation completed
                $('#stanim').find(':submit')[0].disabled = false;
                $('#initelem').find(':submit')[0].disabled = false;
            }
        }// act

        window.location.hash = "#animanc";

        act();

    }

    initGeometry();

    values = randomize();
    
    console.log("canvasApp completed");
}// canvasApp

$(document).ready(canvasApp);
