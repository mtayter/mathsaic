mathsaic.options = (function() {

  // Greyscale-safe color themes. Each theme pairs a very light background
  // with a much darker foreground of the same hue, so the two key colors
  // stay clearly distinguishable even when printed in greyscale (light grey
  // vs near-black), and the key numbers can be printed black-on-light /
  // white-on-dark.
  var themes = [
    { name: 'red',    light: '#FFCDD2', dark: '#B71C1C' },
    { name: 'pink',   light: '#F8BBD0', dark: '#880E4F' },
    { name: 'purple', light: '#E1BEE7', dark: '#4A148C' },
    { name: 'blue',   light: '#BBDEFB', dark: '#0D47A1' },
    { name: 'teal',   light: '#B2DFDB', dark: '#004D40' },
    { name: 'green',  light: '#C8E6C9', dark: '#1B5E20' },
    { name: 'orange', light: '#FFE0B2', dark: '#BF360C' },
    { name: 'brown',  light: '#D7CCC8', dark: '#3E2723' }
  ];

  // Per-player chosen theme index
  var playerThemes = [];

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

  function selectTheme(p, idx) {
    if(playerThemes[p] != null) {
      $('#ptheme_' + p + '_' + playerThemes[p]).removeClass('selected');
    }
    playerThemes[p] = idx;
    $('#ptheme_' + p + '_' + idx).addClass('selected');
  }

  function themeSwatches(p) {
    var html = '<span class="swatches">';
    for(var idx = 0; idx < themes.length; idx++) {
      var t = themes[idx];
      html += '<div id="ptheme_' + p + '_' + idx + '" '
            + 'onClick="mathsaic.options.selectTheme(' + p + ',' + idx + ')" '
            + 'class="theme-swatch" title="' + t.name + ' (light background, dark foreground)" '
            + 'style="background: linear-gradient(90deg, ' + t.light + ' 50%, ' + t.dark + ' 50%)"></div>';
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
      if(playerThemes[p] == null) {
        playerThemes[p] = p % themes.length;
      }
      html += '<div class="player-row">'
            +   '<div class="player-head">🧩 Player ' + (p + 1) + '</div>'
            +   '<label class="field">name <input type="text" class="player-name" id="player_name_' + p + '" size="14"' + (p == 0 ? ' placeholder="e.g. Hannah"' : '') + '></label>'
            +   '<span class="op-group">';
      for(var o = 0; o < OPERATIONS.length; o++) {
        html += '<label class="check">'
              + '<input type="checkbox" class="player-op" data-player="' + p + '" value="' + OPERATIONS[o].value + '"'
              + (OPERATIONS[o].value == '+' || OPERATIONS[o].value == '-' ? ' checked' : '')
              + '> ' + OPERATIONS[o].label + '</label>';
      }
      html +=   '</span>'
            +   '<label class="check"><input type="checkbox" class="player-negative" id="player_negative_' + p + '"> negatives?</label>'
            +   '<label class="field">level <select class="player-level" id="player_level_' + p + '">'
            +     '<option value="0">easy</option>'
            +     '<option value="1">medium</option>'
            +     '<option value="2">hard</option>'
            +   '</select></label>'
            +   '<span class="color-group"><span class="color-label">colors</span>' + themeSwatches(p) + '</span>'
            + '</div>';
    }
    $('#players_container').html(html);

    for(var q = 0; q < count; q++) {
      if(savedNames[q]) {
        $('#player_name_' + q).val(savedNames[q]);
      }
      var chosen = playerThemes[q];
      playerThemes[q] = null;
      selectTheme(q, chosen);
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
      html += '<div class="word-row"><label class="field">word ' + (w + 1) + ' '
            + '<input type="text" class="hunt-word" id="hunt_word_' + w + '" size="18"' + (w == 0 ? ' placeholder="e.g. attic"' : '') + '>'
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
      if(playerThemes[p] == null) {
        alert(name + ' must have a color theme chosen');
        return null;
      }
      var theme = themes[playerThemes[p]];
      players.push({
        name: name,
        options: {
          operations: operations,
          negative: $('#player_negative_' + p).prop('checked'),
          level: parseInt(level, 10),
          colors: [theme.light, theme.dark]
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
  // players. When a word's letter count is not divisible by the player
  // count, the extra letters go to the players who have received the fewest
  // letters so far (ties broken randomly), so the rotation evens out and
  // the running totals per player never differ by more than one.
  // Returns { pages: [...in print order...], answerKey: [...] }.
  function distribute(words, players) {
    var allPages = [];
    var answerKey = [];
    var totals = players.map(function() { return 0; });

    for(var w = 0; w < words.length; w++) {
      var wordNum = w + 1;
      var len = words[w].length;
      var base = Math.floor(len / players.length);
      var extras = len % players.length;

      // rank players by running total (ascending); shuffle first so ties
      // are broken randomly (Array.sort is stable)
      var ranked = shuffle(players.map(function(_, idx) { return idx; }));
      ranked.sort(function(a, b) { return totals[a] - totals[b]; });

      var quota = players.map(function() { return base; });
      for(var e = 0; e < extras; e++) {
        quota[ranked[e]]++;
      }

      // assignment pool: each player repeated quota times, shuffled, then
      // dealt to the word's shuffled letters
      var pool = [];
      for(var pi = 0; pi < players.length; pi++) {
        for(var n = 0; n < quota[pi]; n++) {
          pool.push(pi);
        }
        totals[pi] += quota[pi];
      }
      shuffle(pool);

      var dealt = shuffle(words[w].split('').map(function(ch, i) {
        return { letter: ch, pos: i };
      }));

      var wordPages = [];
      var byPos = [];
      for(var d = 0; d < dealt.length; d++) {
        var playerIdx = pool[d];
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
    var lastWord = words[words.length - 1].toUpperCase();

    var html = '<div class="print-note"><span>Your scavenger hunt is ready. '
             + 'Click print then follow the instructions on the last page.</span> '
             + '<button type="button" class="btn-print" onclick="window.print()">🖨️ Print</button></div>';

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
          +   '<h2>📋 Instructions</h2>'
          +   '<ol class="instructions">'
          +     '<li>Put each word into its own numbered envelope.</li>'
          +     '<li>Place envelopes per instructions in answer key below.</li>'
          +     '<li>Put a prize in <strong>' + escapeHtml(lastWord) + '</strong>.</li>'
          +   '</ol>'
          +   '<h2>🔑 Answer Key</h2>'
          +   '<div class="answer-key">';
    for(var k = 0; k < hunt.answerKey.length; k++) {
      var entry = hunt.answerKey[k];
      var instruction;
      if(k == 0) {
        instruction = 'Hand envelope #1 to the team';
      } else {
        instruction = 'Put envelope #' + entry.wordNum + ' in '
                    + hunt.answerKey[k - 1].word.toUpperCase();
      }
      html += '<div class="answer-word">'
            +   '<div class="answer-letters">';
      for(var j = 0; j < entry.pagesByPos.length; j++) {
        var pg = entry.pagesByPos[j];
        html += '<div class="answer-line">'
              +   '<span class="answer-letter">' + escapeHtml(pg.letter.toUpperCase()) + '</span>'
              +   '<span class="answer-footer">' + escapeHtml(pg.footer) + '</span>'
              + '</div>';
      }
      html +=   '</div>'
            +   '<div class="answer-instruction">➡️ ' + escapeHtml(instruction) + '</div>'
            + '</div>';
    }
    html +=   '</div>'
          + '</div>';

    $('#mathsaic_puzzle').html(html);
    document.getElementById('mathsaic_puzzle').scrollIntoView();
  }

  // ---- init -------------------------------------------------------------------

  function init($container) {
    var input = '<div class="hero">'
      + '<h1>🧩 Mathsaic Scavenger Hunt Maker</h1>'
      + '<p class="intro">Build a scavenger hunt out of Mathsaic letter puzzles. '
      + 'Each word is a clue as to where the next word (or the final prize) can be found. '
      + 'The letters of each word are split between the players, so the team has to solve '
      + 'everyone\'s puzzles and descramble the letters to read each clue.</p>'
      + '</div>'

      + '<section class="card">'
      + '<h2>👥 Players</h2>'
      + '<label class="field">how many players? <input type="number" id="num_players" min="1" max="12" value="2"></label>'
      + '<div id="players_container"></div>'
      + '</section>'

      + '<section class="card">'
      + '<h2>🔤 Words</h2>'
      + '<p class="hint">Each word is a clue as to where the next word (or final prize) can be found.</p>'
      + '<label class="field">how many words? <input type="number" id="num_words" min="1" max="20" value="3"></label>'
      + '<div id="words_container"></div>'
      + '</section>'

      + '<p class="create-row"><button type="button" id="create_hunt" class="btn-primary">🎯 Create Scavenger Hunt</button></p>';

    $container.html(input);

    buildPlayerRows();
    buildWordInputs();

    $('#num_players').on('change', buildPlayerRows);
    $('#num_words').on('change', buildWordInputs);
    $('#create_hunt').on('click', launchHunt);
  }

  return {
    init: init,
    selectTheme: selectTheme,
    launchHunt: launchHunt
  };

}());
