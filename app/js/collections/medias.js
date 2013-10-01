/* global app, Backbone */

app.Collections = app.Collections || {};

(function () {
  'use strict';

  app.Collections.Medias = Backbone.Collection.extend({

    model: app.Models.Media,

    url: 'https://api.instagram.com/v1/users/self/feed',

    sync: function (method, collection, options) {
      options.dataType = 'jsonp';
      return Backbone.sync(method, collection, options);
    },

    parse: function (response) {
      return response.data;
    }
  });

  app.medias = new app.Collections.Medias();
})();
