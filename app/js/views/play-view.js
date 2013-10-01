/* global app, _, Backbone */
/* jshint camelcase: false */

app.Views = app.Views || {};

(function () {
  'use strict';

  app.Views.PlayView = Backbone.View.extend({

    template: _.template($('#play-template').html()),

    initialize: function (options) {
      this.accessToken = options.accessToken;
      this.listenTo(app.medias, 'sync', this._setup);
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    },

    play: function () {
      this.game = new app.Models.Game('board-canvas');
      this.game.on('complete', this._complete.bind(this));

      app.medias.fetch({
        data: {
          access_token: this.accessToken
        },
        success: function (collection, response, options) {
          console.log(collection);
          console.log(response);
          console.log(options);
        },
        error: function (collection, response, options) {
          console.log(collection);
          console.log(response);
          console.log(options);
        },
      });
    },

    _setup: function () {
      this.game.setup(app.medias);
    },

    _complete: function () {
      console.log(this.$('#complete-dialog'));
      this.$('#complete-dialog').modal({
        backdrop: 'static',
        show: true
      });
    }
  });
})();
