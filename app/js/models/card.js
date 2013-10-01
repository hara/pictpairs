/* global app, fabric */

app.Models = app.Models || {};

(function () {
  'use strict';

  app.Models.Card = fabric.util.createClass(fabric.Image, {

    type: 'card',

    initialize: function (faceElement, backElement, options) {
      options = options || {};
      fabric.util.object.extend(options, {
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        flipped: false,
        faceImage: faceElement,
        backImage: backElement,
        matched: false
      });
      this.callSuper('initialize', backElement, options);
    },

    flip: function () {
      if (this.get('flipped')) {
        this.setElement(this.get('backImage'));
        this.set('flipped', false);
      } else {
        this.setElement(this.get('faceImage'));
        this.set('flipped', true);
      }
    },

    isMatch: function (other) {
      return this.get('faceImage').src === other.get('faceImage').src;
    },

    match: function () {
      this.set('matched', true);
      this.fxRemove();
    },

    fxRemove: function (callback) {
      if (this.canvas) {
        this.canvas.fxRemove(this, callback);
      }
    }
  });

  app.Models.Card.fromURL = function(faceURL, backURL, callback, imgOptions) {
    function createImagesLoaded() {
      var faceImage = null,
          backImage = null;

      return function (img) {
        if (img.src === faceURL) {
          faceImage = img;
        }

        if (img.src === backURL) {
          backImage = img;
        }

        if (faceImage && backImage) {
          callback(new app.Models.Card(faceImage, backImage, imgOptions));
        }
      };
    }

    var imagesLoaded = createImagesLoaded();
    fabric.util.loadImage(faceURL, imagesLoaded);
    fabric.util.loadImage(backURL, imagesLoaded);
  };
})();
