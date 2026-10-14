mathsaic.puzzle = (function() {
 
  var $container;
  var letters = [];
  var keys = '';
  var options;

  var num_solutions = 10;
  var solutions = [];
  var factors = [];
  
  var difficulty = {
    solutions_max: [10,100,1000],
    factors_max: [4,7,10],
    divisors: [5,10,20]
  }

  function getRandInt(min,max) {
    return Math.floor(Math.random() * (max+1-min)) + min;
  }

  function createLetter(letter) {

    var bitmap = letters[letter];
    var tbl = "<table class='letters'>";
    var fg;
    var color;

    for(var row in bitmap) {
      tbl += "<tr>";
      for(var col in bitmap[row]) {
        fg = bitmap[row][col];
        color = options.colors[fg];
        tbl += "<td";
        //tbl += " style='background-color:" + color + "'"; // uncomment this line to show solution
        tbl += ">" + createProblem(fg) + "</td>";
      }
      tbl += "</tr>";
    }
    tbl += "</table>";
    return tbl;
  }

  function createProblem(fg) {

    var idx;
    var num;
    var factor;
    var num1;
    var num2;
    var operation;
    var rand;
    var rand2;
    var factor_copy;

    idx = getRandInt(0,num_solutions/2-1) * 2 + fg;

    num = solutions[idx];
    factor = factors[idx];

    if(options.operations.length == 1) {
      operation = options.operations[0];
    } else {
      operation = options.operations[getRandInt(0,options.operations.length-1)];
    }
  
    if(operation == '+') {
      num1 = getRandInt(1,num);
      num2 = num - num1;
    } else if(operation == '-') {
      num2 = getRandInt(1,num);
      num1 = num + num2;
    } else if(operation == '*') {
      rand = getRandInt(1,factor.length-1);
      factor_copy = factor.slice();
      num1 = num2 = 1;
      for(var i=0; i<rand; i++) {
        rand2 = getRandInt(0,factor_copy.length-1);
        num1 *= factor_copy[rand2];
        factor_copy.splice(rand2,1);
      }
      num2 = num / num1;
    } else if(operation == '÷') {
      num2 = getRandInt(1,difficulty.divisors[options.level]);
      num1 = num * num2;
    } else if(operation == '#') {
      return num;
    }

    return num1 + " " + operation + " " + num2;
  }

  function populateSolutions() {

    var x;
    var negative_multiplier;

    factors.length = 0;
    for(var i=0; i<num_solutions; i++) {
      factors[i] = [];
    }
    solutions.length = 0;
    while(solutions.length < num_solutions) {
      if(options.operations.indexOf('*') == -1) {
        negative_multiplier = (options.negative && getRandInt(0,1)) ? -1 : 1;
        x = getRandInt(difficulty.solutions_max[options.level]/10,difficulty.solutions_max[options.level]) * negative_multiplier;
        if(solutions.indexOf(x) == -1) {
          solutions.push(x);
        }
      } else {
        x = 1;
        for(var j=0; j<5; j++) {
          negative_multiplier = (options.negative && getRandInt(0,1)) ? -1 : 1;
          factors[solutions.length][j] = getRandInt(2,difficulty.factors_max[options.level]) * negative_multiplier;
          x *= factors[solutions.length][j];
        }
        if(solutions.indexOf(x) == -1) {
          solutions.push(x);
        }
      }
    }
  }

  function createPuzzle(o) {

    var tbl;

    options = o;

    populateSolutions();
 
    // create key
    tbl = "<table class='key'><tr>";
    for(var i=0; i<solutions.length; i++) {
      tbl += "<td style='background-color:" + options.colors[i%2] + "'>" + solutions[i] + "</td>";
    }
    tbl += "</tr></table>";

    // create puzzle
    tbl += "<table class='wrapper'><tr>";
    for(var i in options.word) {
      tbl += "<td>" + createLetter(options.word[i]) + "</td>";
      if(i < (options.word.length-1)) {
        tbl += "<td>" + createLetter(' ') + "</td>";
      }
    }
    tbl += "</tr></table>";
  
    // create puzzle
    $container.html(tbl);
  }
  
  function getKeys() {
    return keys;
  }

  function init($c) {
    $container = $c;
    letters[' '] = [[0],[0],[0],[0],[0]];
    letters['a'] = [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]];
    letters['b'] = [[1,1,0],[1,0,1],[1,1,1],[1,0,1],[1,1,0]];
    letters['c'] = [[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,1,1]];
    letters['d'] = [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]];
    letters['e'] = [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]];
    letters['f'] = [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]];
    letters['g'] = [[1,1,1,1],[1,0,0,0],[1,0,1,1],[1,0,0,1],[1,1,1,1]];
    letters['h'] = [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]];
    letters['i'] = [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]];
    letters['j'] = [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[1,1,1]];
    letters['k'] = [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1]];
    letters['l'] = [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]];
    letters['m'] = [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]];
    letters['n'] = [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]];
    letters['o'] = [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]];
    letters['p'] = [[1,1,1],[1,0,1],[1,1,1],[1,0,0],[1,0,0]];
    letters['q'] = [[1,1,1,0],[1,0,1,0],[1,0,1,0],[1,0,1,0],[1,1,1,1]];
    letters['r'] = [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,1,0],[1,0,0,1]];
    letters['s'] = [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]];
    letters['t'] = [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]];
    letters['u'] = [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]];
    letters['v'] = [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0]];
    letters['w'] = [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,1,0,1],[0,1,0,1,0]];
    letters['x'] = [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]];
    letters['y'] = [[1,0,1],[1,0,1],[1,1,1],[0,1,0],[0,1,0]];
    letters['z'] = [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]];
    for(var l in letters) {
      keys += l;
    }
  }

  return {
    init: init,
    getKeys: getKeys,
    createPuzzle: createPuzzle
  };

}());
