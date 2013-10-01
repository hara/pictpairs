/* global app, _, fabric */

app.Models = app.Models || {};

(function () {
  'use strict';

  app.Models.Game = fabric.util.createClass(fabric.Object, fabric.Observable, {

    type: 'game',

    cells: function () {
      return this.get('row') * this.get('column');
    },

    requiredCards: function () {
      return (this.cells() - 1) / 2;
    },

    width: function () {
      return this.cellWidth * this.get('column') +
             this.cellPadding * (this.get('column') + 1);
    },

    height: function () {
      return this.cellHeight * this.get('row') +
             this.cellPadding * (this.get('row') + 1);
    },

    initialize: function(id, options) {
      options = options || {};
      fabric.util.object.extend(options, {
        row: 3,
        column: 3,
        cellWidth: 150,
        cellHeight: 150,
        cellPadding: 10,
        backImageURL: location.protocol + '//' + location.host + $('#' + id).data('back-image')
      });
      this.callSuper('initialize', options);

      this._initCanvas(id);
      this._initGame();
    },

    setup: function (medias) {
      this._cards = [];
      this._medias = medias.chain().shuffle().first(this.requiredCards()).value();

      var that = this;
      _.each(this._medias, function(media) {
        app.Models.Card.fromURL(media.thumbnailUrl(), that.get('backImageURL'), function (card) {
          that._addCard(card);
        });

        app.Models.Card.fromURL(media.thumbnailUrl(), that.get('backImageURL'), function (card) {
          that._addCard(card);
        });
      }, this);
    },

    _initCanvas: function (id) {
      this.canvas = new fabric.Canvas(id);
      this.canvas.setDimensions({
        width: this.width(),
        height: this.height()
      });
      this.canvas.on('mouse:up', this._onCanvasClicked.bind(this));
    },

    _onCanvasClicked: function (e) {
      if (e.target && e.target.type === 'card' && this._clickable) {
        e.target.trigger('clicked');
      }
    },

    _initGame: function () {
      this._clickable = false;
    },

    _addCard: function (card) {
      card.set({
        left: this.width() / 2,
        top: this.height() / 2
      });

      this._cards.push(card);
      this.canvas.add(card);

      if (this._cards.length === this._medias.length * 2) {
        var positions = _.range(this._cards.length);
        positions = _.shuffle(positions);
        positions = _.map(positions, function (p) {
          return (p < this._medias.length) ? p : p + 1;
        }, this);

        _.each(this._cards, function (card, index) {
          card.set({
            position: positions[index],
            row: this._rowNumber(positions[index]),
            column: this._columnNumber(positions[index])
          });
          this._layCard(card);
        }, this);
        this._clickable = true;
      }
    },

    _rowNumber: function (pos) {
      return Math.floor(pos / this.get('column'));
    },

    _columnNumber: function (pos) {
      return pos % this.get('column');
    },

    _layCard: function (card) {
      var that = this;

      card.animate({
        left: this._left(card),
        top: this._top(card)
      }, {
        easing: fabric.util.ease.easeInOutCubic,
        onChange: this.canvas.renderAll.bind(this.canvas)
      });

      card.on('clicked', function () {
        that._flipCard(card);
      });
    },

    _left: function (card) {
      return this.cellPadding * (card.column + 1) +
             this.cellWidth * card.column + this.cellWidth / 2;
    },

    _top: function (card) {
      return this.cellPadding * (card.row + 1) +
             this.cellHeight * card.row + this.cellHeight / 2;
    },

    _flipCard: function (card) {
      if (!this._flippedCard) {
        card.flip();
        this._flippedCard = card;
      } else if (this._flippedCard !== card) {
        card.flip();
        this._clickable = false;
        setTimeout(this._judge.bind(this, card), 1000);
      }
      this.canvas.renderAll();
    },

    _judge: function (card) {
      if (this._flippedCard.isMatch(card)) {
        this._flippedCard.match();
        card.match();
      } else {
        this._flippedCard.flip();
        card.flip();
      }
      this.canvas.renderAll();
      this._flippedCard = null;
      this._clickable = true;

      if (_.every(this._cards, function (card) { return card.get('matched'); })) {
        console.log('game:complete');
        this.trigger('complete');
      }
    }
  });

})();
