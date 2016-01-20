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
    const entries = _filter(window.performance.getEntries(), function(entry) {
      return entry.entryType === 'measure' || entry.entryType === 'mark';
    });

    this.data = [];

    _forEach(entries, (entry) => {
      this.data.push({
        label: entry.name,
        type: entry.entryType,
        duration: parseInt(entry.duration, 10),
        start: parseInt(entry.startTime, 10),
      });
    });
  },

  createHTML: function() {
    $('body').prepend(template(this.data));

    this.setBarPositions();
  },

  setupEvents: function() {
    $('.perfBookmarklet--close-button').on('click', function(e) {
      $(e.target).closest('.perfBookmarklet').remove();
    });

    $('.perfBookmarklet--dock').on('click', function(e) {
      $('.perfBookmarklet').toggleClass('docked');
    });

    $('.perfBookmarklet--filter').on('keyup', this.filter);
  },

  convertToPercent: function(num) {
    return num / this.max * 100;
  },

  setMax: function() {
    var max = _maxBy(this.data, function(o) {
      return o.start + o.duration;
    });

    this.max = max.start + max.duration;
  },

  setBarPositions: function() {
    let $bars = $('.perfBookmarklet--item-bar--active');
    let self = this;

    this.setMax();
    $bars.each(function(index, bar) {
      $(bar).css({
        width: self.convertToPercent(self.data[index].duration) + '%',
        left: self.convertToPercent(self.data[index].start) + '%',
      });
    });
  },

  filter: function(e) {
    var filter = new RegExp(e.target.value.toLowerCase());

    $('.perfBookmarklet--label').each(function() {
      var $this = $(this);

      if (filter.test($this.text().toLowerCase())) {
        $this.closest('.perfBookmarklet--item-wrapper').fadeIn();
      } else {
        $this.closest('.perfBookmarklet--item-wrapper').fadeOut();
      }
    });
  },

  init: function() {
    this.getData();
    this.createHTML();
    this.setupEvents();
  },
};

performanceMeasureBookmarklet.init();
