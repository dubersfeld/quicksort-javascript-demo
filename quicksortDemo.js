"use strict";

function canvasSupport() {
  return !!document.createElement('canvas').getContext;
} 


function canvasApp() {

  var N = 100;// number of elements to sort

  var delay = 100;

  var randomized = false;
 
  var sorter = null;

  var values = [];// values to be sorted

  var results = [];// array of arrays

  var count = 0;// number of comparisons for display only 
  var swapCount = 0;// number of swaps for display only


  function Sorter(values) {
   
    this.values = values;
    this.aux = [];

    // used for animation only
    this.display = function() {
        var disp = [];
        for (var i = 0; i < this.mLength; i++) {
            disp.push(values[ this.aux[i] ]);
        }
        drawValues(disp);
    };// display

    this.mLength = values.length;

    this.swap = function(i, j) {// swap aux[i] and aux[j], not i an j
      var temp = this.aux[i];
      this.aux[i] = this.aux[j];
      this.aux[j] = temp;
    };// swap

    this.partition = function(p, r) {
        var temp = this.values[ this.aux[r] ];
        var i = p;

        for (var j = p; j < r; j++) {
          if (this.values[ this.aux[j] ] <= temp) {
            i++;
            this.swap(i-1, j);
            swapCount++;
          }
	  count++;
        }

        this.swap(i, r);
        swapCount++;

        return i; 
    };// partition

    // main method, non recursive quicksort implementation, using explicit stack
    this.quickSort = function() {
        
        var stack = [];

        var p, q, r, top;

        stack.push([0, this.mLength-1]);
           
        // main loop
        while (stack.length > 0) {         
          top = stack.pop();
          p = top[0];
          r = top[1];
                
          q = this.partition(p, r);        

          // push on stacks
          if (q > 0 && p < q-1) {                        
            stack.push([p, q-1]);
          }

          if (r < this.mLength && q+1 < r) {                        
            stack.push([q+1, r]);
          }
                 
          results.push(this.aux.slice(0));// save copy for animation
        }        

    };// quickSort
 
    // initialize
    for (var i = 0; i < this.mLength; i++) {
      this.aux.push(i);
    } 
  
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


  function renderAnim(aux) {// aux is a copy of Sorter.aux array  
    fillBackground();
  
    var dloc = [];
    
    for (var i = 0; i < N; i++) {
      dloc.push(values[ aux[i] ]);
    }
   
    drawValues(dloc);

  }// renderAnim


  function initValues() {
    
    randomize();
   
  }// initValues

  if (!canvasSupport()) {
    return;
  } else {
    var theCanvas = $('#canvas')[0];
    var context = theCanvas.getContext("2d");
  }// if

 
  var xMin = 0;
  var yMin = 0;
  var xMax = theCanvas.width;
  var yMax = theCanvas.height;

  var xPos = [];
  
  function init() {
    // reset animation arrays
    results.length = 0; 
   
    if (!randomized) {
      initValues();
    }

    fillBackground();

    sorter = null;// reset

    sorter = new Sorter(values);

    // initial display
    sorter.display();

    sorter.quickSort();

    // display count
    $('#count').text(count);

    // display swapCount
    $('#swapCount').text(swapCount);

    $('#stanim').find(':submit')[0].disabled = false;
    $('#initelem').find(':submit')[0].disabled = false;
  
  }// init
  
  function randomize() { 
    var val;
    var more;

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
    init();

  }// randomize

  $('#initelem').submit(function(event) { randomize(); return false; } );

  $('#stanim').submit(function(event) { 
			startAnim(); 
			$('#stanim').find(':submit')[0].disabled = true; 
			$('#initelem').find(':submit')[0].disabled = true;  
			return false; });

  initGeometry();

  init();

 
  function startAnim() {
    // initialize
    var iAnim = 0;
    var tempAux = [];

    for (var i = 0; i < values.length; i++) {
      tempAux.push(i);
    } 

    function act() {     
      renderAnim(tempAux);

      tempAux = results[iAnim];
    
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

  }// startAnim

}// canvasApp


function eventWindowLoaded() {
  canvasApp();
}// canvasApp

$(document).ready(eventWindowLoaded);

