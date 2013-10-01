/* global app, Backbone */

app.Models = app.Models || {};

(function () {
  'use strict';

  app.Models.Media = Backbone.Model.extend({
    thumbnailUrl: function () {
      return this.get('images').thumbnail.url;
    }
  });
})();
