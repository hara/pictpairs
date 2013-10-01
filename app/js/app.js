/* global app */

window.app = {
  Models: {},
  Collections: {},
  Views: {},
  init: function () {
    'use strict';

    new app.Views.AppView();
  }
};

$(document).ready(function () {
  'use strict';

  app.init();
});
