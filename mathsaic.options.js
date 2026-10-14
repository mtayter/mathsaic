mathsaic.options = (function() {
 
  var colors = ['red','pink','purple','blue','teal','orange','grey','brown']
  var chosenColor = [];

  
  function selectColor(fg,idx) {
    if(chosenColor[fg] != null) {
      $('#color_'+fg+'_'+chosenColor[fg]).removeClass('selected');
    }
    $('#color_'+fg+'_'+idx).addClass('selected');
    chosenColor[fg] = idx;
  }

  function launchPuzzle() {

    var letters = mathsaic.puzzle.getKeys();

    var options = {
      word: null,
      operations: [],
      negative: null,
      level: null,
      colors: []
    }

    var level_select;

    options.word = $('#word')[0].value.toLowerCase();
    if(options.word.length == 0) {
      alert('word cannot be blank');
      return;
    }

    for(var i=0; i<options.word.length; i++) {
      if(letters.indexOf(options.word[i]) == -1) {
        alert('cannot use ' + options.word[i]);
        return;
      }
    }

    options.operations.length = 0;
    if($('#addition')[0].checked) {
      options.operations.push('+');
    }
    if($('#subtraction')[0].checked) {
      options.operations.push('-');
    }
    if($('#multiplication')[0].checked) {
      options.operations.push('*');
    }
    if($('#division')[0].checked) {
      options.operations.push('÷');
    }
    if($('#number')[0].checked) {
      options.operations.push('#');
    }
    if(!options.operations.length) {
      alert('must include at least one operation');
      return;
    }
 
    options.negative = $('#negative')[0].checked;

    level_select = $('#level')[0];
    options.level = level_select.options[level_select.selectedIndex].value;
    if(options.level == '') {
      alert('must choose a level');
      return;
    }
  
    if(chosenColor[0] == null || chosenColor[1] == null) {
      alert('must choose both colors.');
      return;
    }

    options.colors[0] = colors[chosenColor[0]];
    options.colors[1] = colors[chosenColor[1]];

    mathsaic.puzzle.createPuzzle(options);

  }

  function init($container) {
    var input = '<table>'
              + '<tr><td>word</td><td><input id="word" type="text" size="4" maxlength="4"></td></tr>'
              + '<tr><td colspan="2"></td></tr>'
              + '<tr><td>addition</td><td><input type="checkbox" id="addition"></td></tr>'
              + '<tr><td>subtraction</td><td><input type="checkbox" id="subtraction"></td></tr>'
              + '<tr><td>multiplication</td><td><input type="checkbox" id="multiplication"></td></tr>'
              + '<tr><td>division</td><td><input type="checkbox" id="division"></td></tr>'
              + '<tr><td>number</td><td><input type="checkbox" id="number"></td></tr>'
              + '<tr><td colspan="2"></td></tr>'
              + '<tr><td>negatives?</td><td><input type="checkbox" id="negative"></td></tr>'
              + '<tr><td colspan="2"></td></tr>'
              + '<tr><td>level</td><td>'
              + '<select id="level">'
              + '<option value=""></option>'
              + '<option value="0">easy</option>'
              + '<option value="1">medium</option>'
              + '<option value="2">hard</option>'
              + '</select>'
              + '</td></tr>'
              + '<tr><td colspan="2"></td></tr>'
              + '<tr><td>background</td><td>foreground</td></tr>';
    for(idx in colors) {
      input += '<tr>';
      for(var i=0; i<2; i++) {
        input += '<td><div id="color_' + i + '_' + idx + '" onClick="mathsaic.options.selectColor(' + i + ',' + idx + ')" class="box" style="background-color: ' + colors[idx] + '"></div></td>';
      }
      input += '</tr>';
    }
    input +=    '<tr><td colspan="2"></td></tr>'
              + '<tr><td colspan="2"><input type="button" value="Create Puzzle" onClick="mathsaic.options.launchPuzzle()"></td></tr>'
              + '</table>';
    $container.html(input);
  }

  return {
    init: init,
    selectColor: selectColor,
    launchPuzzle: launchPuzzle
  };

}());
