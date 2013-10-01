/* global app, _, Backbone */

app.Views = app.Views || {};

(function () {
  'use strict';

  app.Views.LoginView = Backbone.View.extend({

    template: _.template($('#login-template').html()),

    initialize: function () {
    },

    render: function () {
      this.$el.html(this.template());
      this.$loginButton = this.$('#login-button');
      var redirectPath = this.$loginButton.data('redirect-path');
      var redirectUri = this.redirectUrl(redirectPath);
      var clientId = this.$loginButton.data('client-id');
      this.$loginButton.attr('href',
                             this.authorizeUrl(clientId, redirectUri));
      return this;
    },

    redirectUrl: function (pathname) {
      return location.protocol + '//' +
             location.host +
             pathname;
    },

    authorizeUrl: function (clientId, redirectUri) {
      return 'https://instagram.com/oauth/authorize/' +
             '?client_id=' + clientId +
             '&redirect_uri=' + redirectUri +
             '&response_type=token';
    }

  });
})();
