mathsaic = (function() {
 
  function init($container) {
    $container.html('<div id="mathsaic">'
                  + '  <div id="mathsaic_options"></div>'
                  + '  <div id="mathsaic_puzzle"></div>'
                  + '</div>');
    mathsaic.options.init($('#mathsaic_options'));
    mathsaic.puzzle.init($('#mathsaic_puzzle'));
  }

  return {
    init: init,
  };

}());
