// This work is licensed under a Creative Commons
// Attribution-ShareAlike 3.0 Unported License.

import '../scss/perfBookmarklet.scss';
import $ from 'jquery';
import template from './template.hbs';
import _maxBy from 'lodash/maxBy';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';

window.performanceMeasureBookmarklet = {
  getData: function() {
    const measures = _filter(window.performance.getEntries(), {
          entryType: 'measure',
        });

    this.data = [];

    _forEach(measures, (measure) => {
      this.data.push({
        label: measure.name,
        duration: parseInt(measure.duration, 10),
        start: parseInt(measure.startTime, 10),
      });
    });
  },

  createHTML: function() {
    $('body').append(template(this.data));

    this.setScale();
    this.setBarPositions();
  },

  setupEvents: function() {
    $('.perfBookmarklet .close-button').on('click', function(e) {
      $(e.target).closest('.perfBookmarklet').remove();
    });
  },

  convertToPercent: function(num) {
    return num / this.max * 100;
  },

  setScale: function() {
    var max = _maxBy(this.data, function(o) {
      return o.start + o.duration;
    });

    this.scale = (max.start + max.duration) / $('.item-bar').width();
    this.max = max.start + max.duration;
  },

  setBarPositions: function() {
    let $bars = $('.perfBookmarklet .item-bar--active');
    let self = this;

    $bars.each(function(index, bar) {
      console.log('width: ', self.convertToPercent(self.data[index].duration) + '%');
      console.log('left: ', self.convertToPercent(self.data[index].start) + '%');
      $(bar).css({
        width: self.convertToPercent(self.data[index].duration) + '%',
        left: self.convertToPercent(self.data[index].start) + '%',
      });
    });
  },

  init: function() {
    // this.handlebarsHelperInit();
    this.getData();
    this.createHTML();
    this.setupEvents();
  },
};

performanceMeasureBookmarklet.init();
