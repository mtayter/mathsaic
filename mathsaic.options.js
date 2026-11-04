mathsaic.options = (function() {

  var colors = ['red','pink','purple','blue','teal','orange','grey','brown'];

  // Per-player chosen colors: playerColors[p] = [backgroundIdx, foregroundIdx]
  var playerColors = [];

  var OPERATIONS = [
    { value: '+', label: 'addition' },
    { value: '-', label: 'subtraction' },
    { value: '*', label: 'multiplication' },
    { value: '÷', label: 'division' },
    { value: '#', label: 'number' }
  ];

  function shuffle(arr) {
    for(var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- player rows -------------------------------------------------------

  function defaultColors(p) {
    var bg = (p * 2 + 5) % colors.length;        // start from a light-ish tone
    var fg = (p * 2 + 1) % colors.length;
    if(fg == bg) {
      fg = (fg + 1) % colors.length;
    }
    return [bg, fg];
  }

  function selectPlayerColor(p, fg, idx) {
    if(playerColors[p] && playerColors[p][fg] != null) {
      $('#pcolor_' + p + '_' + fg + '_' + playerColors[p][fg]).removeClass('selected');
    }
    if(!playerColors[p]) {
      playerColors[p] = [null, null];
    }
    playerColors[p][fg] = idx;
    $('#pcolor_' + p + '_' + fg + '_' + idx).addClass('selected');
  }

  function colorSwatches(p, fg) {
    var html = '<span class="swatches">';
    for(var idx = 0; idx < colors.length; idx++) {
      html += '<div id="pcolor_' + p + '_' + fg + '_' + idx + '" '
            + 'onClick="mathsaic.options.selectPlayerColor(' + p + ',' + fg + ',' + idx + ')" '
            + 'class="box" style="background-color: ' + colors[idx] + '" '
            + 'title="' + colors[idx] + '"></div>';
    }
    html += '</span>';
    return html;
  }

  function buildPlayerRows() {
    var count = parseInt($('#num_players').val(), 10);
    if(isNaN(count) || count < 1) {
      return;
    }

    // preserve names already typed
    var savedNames = [];
    $('.player-name').each(function(i) { savedNames[i] = this.value; });

    var html = '';
    for(var p = 0; p < count; p++) {
      if(!playerColors[p]) {
        playerColors[p] = defaultColors(p);
      }
      html += '<div class="player-row">'
            +   '<div class="player-head">Player ' + (p + 1) + '</div>'
            +   '<label>name <input type="text" class="player-name" id="player_name_' + p + '" size="14"></label>'
            +   '<span class="op-group">';
      for(var o = 0; o < OPERATIONS.length; o++) {
        html += '<label>' + OPERATIONS[o].label + ' '
              + '<input type="checkbox" class="player-op" data-player="' + p + '" value="' + OPERATIONS[o].value + '"'
              + (OPERATIONS[o].value == '+' || OPERATIONS[o].value == '-' ? ' checked' : '')
              + '></label> ';
      }
      html +=   '</span>'
            +   '<label>negatives? <input type="checkbox" class="player-negative" id="player_negative_' + p + '"></label>'
            +   '<label>level <select class="player-level" id="player_level_' + p + '">'
            +     '<option value="0">easy</option>'
            +     '<option value="1">medium</option>'
            +     '<option value="2">hard</option>'
            +   '</select></label>'
            +   '<span class="color-group"><span class="color-label">background</span>' + colorSwatches(p, 0) + '</span>'
            +   '<span class="color-group"><span class="color-label">foreground</span>' + colorSwatches(p, 1) + '</span>'
            + '</div>';
    }
    $('#players_container').html(html);

    for(var q = 0; q < count; q++) {
      if(savedNames[q]) {
        $('#player_name_' + q).val(savedNames[q]);
      }
      // mark the pre-chosen default colors as selected
      var chosen = playerColors[q];
      playerColors[q] = [null, null];
      if(chosen[0] != null) { selectPlayerColor(q, 0, chosen[0]); }
      if(chosen[1] != null) { selectPlayerColor(q, 1, chosen[1]); }
    }
  }

  // ---- word inputs ---------------------------------------------------------

  function buildWordInputs() {
    var count = parseInt($('#num_words').val(), 10);
    if(isNaN(count) || count < 1) {
      return;
    }
    var saved = [];
    $('.hunt-word').each(function(i) { saved[i] = this.value; });

    var html = '';
    for(var w = 0; w < count; w++) {
      html += '<div class="word-row"><label>word ' + (w + 1) + ' '
            + '<input type="text" class="hunt-word" id="hunt_word_' + w + '" size="18">'
            + '</label></div>';
    }
    $('#words_container').html(html);
    for(var i = 0; i < count; i++) {
      if(saved[i]) {
        $('#hunt_word_' + i).val(saved[i]);
      }
    }
  }

  // ---- gathering + validation ----------------------------------------------

  function gatherPlayers() {
    var players = [];
    var count = parseInt($('#num_players').val(), 10);
    for(var p = 0; p < count; p++) {
      var name = $.trim($('#player_name_' + p).val());
      if(!name) {
        alert('player ' + (p + 1) + ' needs a name');
        return null;
      }
      var operations = [];
      $('.player-op[data-player="' + p + '"]:checked').each(function() {
        operations.push(this.value);
      });
      if(!operations.length) {
        alert(name + ' must include at least one operation');
        return null;
      }
      var level = $('#player_level_' + p).val();
      if(playerColors[p] == null || playerColors[p][0] == null || playerColors[p][1] == null) {
        alert(name + ' must have both colors chosen');
        return null;
      }
      players.push({
        name: name,
        options: {
          operations: operations,
          negative: $('#player_negative_' + p).prop('checked'),
          level: parseInt(level, 10),
          colors: [colors[playerColors[p][0]], colors[playerColors[p][1]]]
        }
      });
    }
    return players;
  }

  function gatherWords() {
    var letters = mathsaic.puzzle.getKeys();
    var words = [];
    var count = parseInt($('#num_words').val(), 10);
    for(var w = 0; w < count; w++) {
      var word = $.trim($('#hunt_word_' + w).val()).toLowerCase();
      if(!word) {
        alert('word ' + (w + 1) + ' cannot be blank');
        return null;
      }
      for(var i = 0; i < word.length; i++) {
        if(letters.indexOf(word[i]) == -1 || word[i] == ' ') {
          alert('word ' + (w + 1) + ': cannot use "' + word[i] + '" (letters a-z only)');
          return null;
        }
      }
      words.push(word);
    }
    return words;
  }

  // ---- hunt generation -------------------------------------------------------

  // Divide each word's letters randomly, as evenly as possible, among the
  // players. Returns { pages: [...in print order...], answerKey: [...] }.
  function distribute(words, players) {
    var allPages = [];
    var answerKey = [];

    for(var w = 0; w < words.length; w++) {
      var wordNum = w + 1;
      var letterObjs = [];
      for(var i = 0; i < words[w].length; i++) {
        letterObjs.push({ letter: words[w][i], pos: i });
      }

      // shuffle the letters, then deal them round-robin over a shuffled
      // player order: counts per player differ by at most one.
      var dealt = shuffle(letterObjs.slice());
      var order = shuffle(players.map(function(_, idx) { return idx; }));
      var wordPages = [];
      var byPos = [];
      for(var d = 0; d < dealt.length; d++) {
        var playerIdx = order[d % players.length];
        var page = {
          wordNum: wordNum,
          letter: dealt[d].letter,
          pos: dealt[d].pos,
          player: players[playerIdx],
          footer: wordNum + '-' + players[playerIdx].name
        };
        wordPages.push(page);
        byPos[dealt[d].pos] = page;
      }

      // pages print ordered by word number; letters within a word in random order
      allPages = allPages.concat(shuffle(wordPages.slice()));
      answerKey.push({ wordNum: wordNum, word: words[w], pagesByPos: byPos });
    }
    return { pages: allPages, answerKey: answerKey };
  }

  function launchHunt() {
    var players = gatherPlayers();
    if(!players) { return; }
    var words = gatherWords();
    if(!words) { return; }

    var hunt = distribute(words, players);

    var html = '<div class="print-note">Your scavenger hunt is ready below. Print this page '
             + '(one puzzle per printed page), then follow the instructions on the last page.</div>';

    for(var i = 0; i < hunt.pages.length; i++) {
      var page = hunt.pages[i];
      html += '<div class="hunt-page">'
            +   '<div class="hunt-puzzle">'
            +     mathsaic.puzzle.createSingleLetterPuzzle(page.letter, page.player.options)
            +   '</div>'
            +   '<div class="hunt-footer">' + escapeHtml(page.footer) + '</div>'
            + '</div>';
    }

    // last page: instructions + answer key
    html += '<div class="hunt-page hunt-final">'
          +   '<h2>Instructions</h2>'
          +   '<ol class="instructions">'
          +     '<li>Put each word into its own envelope.</li>'
          +     '<li>Hide all but the 1st envelope in the location indicated by the previous word.</li>'
          +     '<li>Put a prize in the location indicated by the last word.</li>'
          +     '<li>Hand the team the first envelope.</li>'
          +   '</ol>'
          +   '<h2>Answer Key</h2>'
          +   '<div class="answer-key">';
    for(var k = 0; k < hunt.answerKey.length; k++) {
      var entry = hunt.answerKey[k];
      html += '<div class="answer-word">';
      for(var j = 0; j < entry.pagesByPos.length; j++) {
        var pg = entry.pagesByPos[j];
        html += '<div class="answer-line">'
              +   '<span class="answer-letter">' + escapeHtml(pg.letter.toUpperCase()) + '</span>'
              +   '<span class="answer-footer">' + escapeHtml(pg.footer) + '</span>'
              + '</div>';
      }
      html += '</div>';
    }
    html +=   '</div>'
          + '</div>';

    $('#mathsaic_puzzle').html(html);
    document.getElementById('mathsaic_puzzle').scrollIntoView();
  }

  // ---- init -------------------------------------------------------------------

  function init($container) {
    var input = '<h1>Mathsaic Scavenger Hunt Maker</h1>'
      + '<p class="intro">Build a scavenger hunt out of Mathsaic letter puzzles. '
      + 'Each word is a clue as to where the next word (or the final prize) can be found. '
      + 'The letters of each word are split between the players, so the team has to solve '
      + 'everyone\'s puzzles and put the letters together to read each clue.</p>'

      + '<h2>Players</h2>'
      + '<label>how many players? <input type="number" id="num_players" min="1" max="12" value="2"></label>'
      + '<div id="players_container"></div>'

      + '<h2>Words</h2>'
      + '<p class="hint">Each word is a clue as to where the next word (or final prize) can be found.</p>'
      + '<label>how many words? <input type="number" id="num_words" min="1" max="20" value="3"></label>'
      + '<div id="words_container"></div>'

      + '<p><input type="button" id="create_hunt" value="Create Scavenger Hunt"></p>';

    $container.html(input);

    buildPlayerRows();
    buildWordInputs();

    $('#num_players').on('change', buildPlayerRows);
    $('#num_words').on('change', buildWordInputs);
    $('#create_hunt').on('click', launchHunt);
  }

  return {
    init: init,
    selectPlayerColor: selectPlayerColor,
    launchHunt: launchHunt
  };

}());
