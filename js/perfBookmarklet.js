// This work is licensed under a Creative Commons
// Attribution-ShareAlike 3.0 Unported License.

window.performanceMeasureBookmarklet = {
  _loadScript: function(url, check) {
    if (typeof window[check] === 'undefined') {
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('charset', 'UTF-8');
      script.setAttribute('src', url);
      return document.documentElement.appendChild(script);
    } else {
      return window[check];
    }
  },

  _buildCloseButton: function($container) {
    var $closeButton = $('<button>close</button>');

    $closeButton.on('click', function() {
      $('#perfBookmarklet').remove();
    });

    $container.append($closeButton);
  },

  _setupHTML: function() {
    var $container = $('<div id="perfBookmarklet"></div>');
    var $chart = $('<div id="perfChart"></canvas>');

    $container.css({
      'z-index': 99999,
      position: 'absolute',
      top: '2%',
      left: '2%',
      width: '96%',
      background: '#fff',
      border: '1px solid #888',
      padding: '10px',
    });

    $container.append($chart);
    this._buildCloseButton($container)
    $('body').append($container);
  },

  _getData: function() {
    var measures = _.filter(window.performance.getEntries(), {
          entryType: 'measure',
        });
    var data = [];

    measures.forEach(function(measure) {
      data.push({
        label: measure.name,
        duration: measure.duration,
        start: measure.startTime,
      });
    });

    return data;
  },

  _getScale: function(data, $item) {
    var max = _.max(data, function(o) { return o.start + o.duration; });

    return (max.start + max.duration) / $item.width();
  },

  _displayTime: function(time) {
    return parseInt(time, 10);
  },

  _drawChart: function(data) {
    var self = this;
    var $itemWrapper;
    var $item;
    var $duration;
    var $label;
    var $chart = $('#perfChart');
    var scale;

    _.forEach(data, function(item, index) {
      $itemWrapper = $('<div class="itemWrapper"></div>');

      $item = $('<span class="item-bar"></span>');
      $item.css({
        display: 'inline-block',
        background: '#eee',
        height: '14px',
        marginTop: '3px',
        width: '80%',
      });
      $itemWrapper.append($item);
      $chart.append($itemWrapper);
      scale = self._getScale(data, $item);

      $active = $('<span class="item-bar--active">' + self._displayTime(item.start) + 'ms</span>');

      $active.css({
        color: '#fff',
        fontSize: '.7em',
        display: 'inline-block',
        background: '#97bbcd',
        height: '100%',
        paddingLeft: '2px',
        top: '-4px',
        width: item.duration / scale + 'px',
        left: item.start / scale + 'px',
        position: 'relative',
      });
      $item.append($active);

      $duration = $('<span class="duration">' + self._displayTime(item.duration) + 'ms</span>');
      $duration.css({
        fontSize: '0.8em',
        color: '#888',
        padding: '0 5px',
      });
      $itemWrapper.append($duration);

      $label = $('<span class="label">' + item.label + '</span>');
      $itemWrapper.append($label);

    })
  },

  _setupEvents: function() {
    var data = performanceMeasureBookmarklet._getData();
    performanceMeasureBookmarklet._drawChart(data);
  },

  init: function() {
    var self = this;
    this._loadScript(
      '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.0.0/lodash.min.js', '_');
    this._loadScript(
      '//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js', '$');

    this._setupHTML();
    this._setupEvents();
  },
};

performanceMeasureBookmarklet.init();
