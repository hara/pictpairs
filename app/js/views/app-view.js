/* global app, Backbone */

app.Views = app.Views || {};

(function () {
  'use strict';

  app.Views.AppView = Backbone.View.extend({

    el: '#pictpairs',

    initialize: function () {
      var accessToken = location.hash.match(/^#access_token=(.+)/);
      if (accessToken) {
        this.play(accessToken[1]);
      } else {
        this.login();
      }
    },

    login: function () {
      var view = new app.Views.LoginView();
      this.$el.append(view.render().el);
    },

    play: function (accessToken) {
      var view = new app.Views.PlayView({accessToken: accessToken});
      this.$el.append(view.render().el);
      view.play();
    }

  });
})();
