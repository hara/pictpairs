window.app={Models:{},Collections:{},Views:{},init:function(){"use strict";new app.Views.AppView}},$(document).ready(function(){"use strict";app.init()}),app.Models=app.Models||{},function(){"use strict";app.Models.Card=fabric.util.createClass(fabric.Image,{type:"card",initialize:function(a,b,c){c=c||{},fabric.util.object.extend(c,{hasControls:!1,hasBorders:!1,lockMovementX:!0,lockMovementY:!0,flipped:!1,faceImage:a,backImage:b,matched:!1}),this.callSuper("initialize",b,c)},flip:function(){this.get("flipped")?(this.setElement(this.get("backImage")),this.set("flipped",!1)):(this.setElement(this.get("faceImage")),this.set("flipped",!0))},isMatch:function(a){return this.get("faceImage").src===a.get("faceImage").src},match:function(){this.set("matched",!0),this.fxRemove()},fxRemove:function(a){this.canvas&&this.canvas.fxRemove(this,a)}}),app.Models.Card.fromURL=function(a,b,c,d){function e(){var e=null,f=null;return function(g){g.src===a&&(e=g),g.src===b&&(f=g),e&&f&&c(new app.Models.Card(e,f,d))}}var f=e();fabric.util.loadImage(a,f),fabric.util.loadImage(b,f)}}(),app.Models=app.Models||{},function(){"use strict";app.Models.Game=fabric.util.createClass(fabric.Object,fabric.Observable,{type:"game",cells:function(){return this.get("row")*this.get("column")},requiredCards:function(){return(this.cells()-1)/2},width:function(){return this.cellWidth*this.get("column")+this.cellPadding*(this.get("column")+1)},height:function(){return this.cellHeight*this.get("row")+this.cellPadding*(this.get("row")+1)},initialize:function(a,b){b=b||{},fabric.util.object.extend(b,{row:3,column:3,cellWidth:150,cellHeight:150,cellPadding:10,backImageURL:location.protocol+"//"+location.host+$("#"+a).data("back-image")}),this.callSuper("initialize",b),this._initCanvas(a),this._initGame()},setup:function(a){this._cards=[],this._medias=a.chain().shuffle().first(this.requiredCards()).value();var b=this;_.each(this._medias,function(a){app.Models.Card.fromURL(a.thumbnailUrl(),b.get("backImageURL"),function(a){b._addCard(a)}),app.Models.Card.fromURL(a.thumbnailUrl(),b.get("backImageURL"),function(a){b._addCard(a)})},this)},_initCanvas:function(a){this.canvas=new fabric.Canvas(a),this.canvas.setDimensions({width:this.width(),height:this.height()}),this.canvas.on("mouse:up",this._onCanvasClicked.bind(this))},_onCanvasClicked:function(a){a.target&&"card"===a.target.type&&this._clickable&&a.target.trigger("clicked")},_initGame:function(){this._clickable=!1},_addCard:function(a){if(a.set({left:this.width()/2,top:this.height()/2}),this._cards.push(a),this.canvas.add(a),this._cards.length===2*this._medias.length){var b=_.range(this._cards.length);b=_.shuffle(b),b=_.map(b,function(a){return a<this._medias.length?a:a+1},this),_.each(this._cards,function(a,c){a.set({position:b[c],row:this._rowNumber(b[c]),column:this._columnNumber(b[c])}),this._layCard(a)},this),this._clickable=!0}},_rowNumber:function(a){return Math.floor(a/this.get("column"))},_columnNumber:function(a){return a%this.get("column")},_layCard:function(a){var b=this;a.animate({left:this._left(a),top:this._top(a)},{easing:fabric.util.ease.easeInOutCubic,onChange:this.canvas.renderAll.bind(this.canvas)}),a.on("clicked",function(){b._flipCard(a)})},_left:function(a){return this.cellPadding*(a.column+1)+this.cellWidth*a.column+this.cellWidth/2},_top:function(a){return this.cellPadding*(a.row+1)+this.cellHeight*a.row+this.cellHeight/2},_flipCard:function(a){this._flippedCard?this._flippedCard!==a&&(a.flip(),this._clickable=!1,setTimeout(this._judge.bind(this,a),1e3)):(a.flip(),this._flippedCard=a),this.canvas.renderAll()},_judge:function(a){this._flippedCard.isMatch(a)?(this._flippedCard.match(),a.match()):(this._flippedCard.flip(),a.flip()),this.canvas.renderAll(),this._flippedCard=null,this._clickable=!0,_.every(this._cards,function(a){return a.get("matched")})&&(console.log("game:complete"),this.trigger("complete"))}})}(),app.Models=app.Models||{},function(){"use strict";app.Models.Media=Backbone.Model.extend({thumbnailUrl:function(){return this.get("images").thumbnail.url}})}(),app.Collections=app.Collections||{},function(){"use strict";app.Collections.Medias=Backbone.Collection.extend({model:app.Models.Media,url:"https://api.instagram.com/v1/users/self/feed",sync:function(a,b,c){return c.dataType="jsonp",Backbone.sync(a,b,c)},parse:function(a){return a.data}}),app.medias=new app.Collections.Medias}(),app.Views=app.Views||{},function(){"use strict";app.Views.AppView=Backbone.View.extend({el:"#pictpairs",initialize:function(){var a=location.hash.match(/^#access_token=(.+)/);a?this.play(a[1]):this.login()},login:function(){var a=new app.Views.LoginView;this.$el.append(a.render().el)},play:function(a){var b=new app.Views.PlayView({accessToken:a});this.$el.append(b.render().el),b.play()}})}(),app.Views=app.Views||{},function(){"use strict";app.Views.LoginView=Backbone.View.extend({template:_.template($("#login-template").html()),initialize:function(){},render:function(){this.$el.html(this.template()),this.$loginButton=this.$("#login-button");var a=this.$loginButton.data("redirect-path"),b=this.redirectUrl(a),c=this.$loginButton.data("client-id");return this.$loginButton.attr("href",this.authorizeUrl(c,b)),this},redirectUrl:function(a){return location.protocol+"//"+location.host+a},authorizeUrl:function(a,b){return"https://instagram.com/oauth/authorize/?client_id="+a+"&redirect_uri="+b+"&response_type=token"}})}(),app.Views=app.Views||{},function(){"use strict";app.Views.PlayView=Backbone.View.extend({template:_.template($("#play-template").html()),initialize:function(a){this.accessToken=a.accessToken,this.listenTo(app.medias,"sync",this._setup)},render:function(){return this.$el.html(this.template()),this},play:function(){this.game=new app.Models.Game("board-canvas"),this.game.on("complete",this._complete.bind(this)),app.medias.fetch({data:{access_token:this.accessToken},success:function(a,b,c){console.log(a),console.log(b),console.log(c)},error:function(a,b,c){console.log(a),console.log(b),console.log(c)}})},_setup:function(){this.game.setup(app.medias)},_complete:function(){console.log(this.$("#complete-dialog")),this.$("#complete-dialog").modal({backdrop:"static",show:!0})}})}();