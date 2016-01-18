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

  _buildCloseButton($container) {
    var $closeButton = $('<button>close</button>');

    $closeButton.on('click', function() {
      $('#perfBookmarklet').remove();
    });

    $container.append($closeButton);
  },

  _setupHTML: function() {
    console.log('setting up html');
    var $container = $('<div id="perfBookmarklet"></div>');
    var $canvas = $('<canvas id="perfChart"></canvas>');

    $container.css({
      'z-index': 99999,
      position: 'absolute',
      top: '2%',
      left: '2%',
      width: '96%',
      height: '300px',
      background: '#fff',
      border: '1px solid #888',
      padding: '10px',
    });

    $container.append($canvas);
    this._buildCloseButton($container)
    $('body').append($container);
  },

  _getData() {
    var measures = _.filter(window.performance.getEntries(), {
          entryType: 'measure',
        });
    var data = {
          labels: [],
          datasets: [
            {
              label: 'Performance.measures',
              fillColor: 'rgba(151,187,205,0.5)',
              strokeColor: 'rgba(151,187,205,0.8)',
              highlightFill: 'rgba(151,187,205,0.75)',
              highlightStroke: 'rgba(151,187,205,1)',
              data: [],
            },
          ],
        };

    measures.forEach(function(measure) {
      data.labels.push(measure.name);
      data.datasets[0].data.push(measure.duration);
    });

    return data;
  },

  _drawChart(data) {
    var $canvas = $('#perfChart');
    var ctx = $canvas[0].getContext('2d');
    var perfChart;

    $canvas.css({
      width: data.labels.length * 60,
      height: '100%',
    });

    perfChart = new Chart(ctx).Bar(data);
  },

  init: function() {
    var chartjs = this._loadScript(
      '//cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js', 'Chart');
    this._loadScript(
      '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.0.0/lodash.min.js', '_');
    this._loadScript(
      '//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js', '$');
    this._setupHTML();

    $(chartjs).on('load', function() {
      var data = performanceMeasureBookmarklet._getData();
      performanceMeasureBookmarklet._drawChart(data);
    });

  },
};

performanceMeasureBookmarklet.init();
