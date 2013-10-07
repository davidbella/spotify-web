(function ($) {
  // Creating a new model to explicitly hold Spotify tracks returned from their web service
  var SpotifyResult = Backbone.Model.extend({
    defaults: {
      artist: 'Unknown Artist',
      title: 'Unknown Title',
      album: 'Unknown Album',
      uri: 'URI not found'
    },
  });

  var SpotifyResultLibrary = Backbone.Collection.extend({
    model: SpotifyResult,
    url: '/spotify'
  });

  var SpotifyResultView = Backbone.View.extend({
    tagName: 'div',
    className: 'spotifyResultContainer',
    template: $('#spotifyResultTemplate').html(),

    render: function () {
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    },

    suggestSong: function () {
      songLibraryView.collection.create(this.model.attributes);
    },

    events: {
      'click .suggestSong': 'suggestSong'
    }
  });

  var SpotifyResultLibraryView = Backbone.View.extend({
    el: $('#spotifyResults'),

    initialize: function () {
      this.collection = new SpotifyResultLibrary();
      this.render();

      this.collection.on('add', this.renderSpotifyResult, this);
      this.collection.on('fetch', this.render, this);
    },

    render: function () {
      var thisView = this;
      _.each(this.collection.models, function (item) {
        thisView.renderSpotifyResult(item);
      }, this);
    },

    addSpotifyResult: function (e) {
      e.preventDefault();

      this.collection.reset();
      $('.spotifyResultContainer').remove();

      var query = $('#spotifyResults :input').val();
      if (query === '')
        return;

      this.collection.fetch({ data: $.param({ type: 'tracks', query: query, maxResults: 5 }) });
    },

    renderSpotifyResult: function (item) {
      var spotifyResultView = new SpotifyResultView({
        model: item
      });
      this.$el.append(spotifyResultView.render().el);
    },

    events: {
      'click #searchButton': 'addSpotifyResult'
    }
  });

  // This is the model in backbone that holds the basic JSON object we use
  var Song = Backbone.Model.extend({
    defaults: {
      artist: 'Unknown Artist',
      title: 'Unknown Title',
      album: 'Unknown Album',
      uri: 'URI not found'
    },
    // The backbone id attribute default is 'id', but we use MongoDB on the back end that uses '_id'
    idAttribute: '_id'
  });

  // A backbone collection contains a model type
  // Also, we put a url here that we can tie this collection to a RESTful API
  var SongLibrary = Backbone.Collection.extend({
    model: Song,
    url:'/songs'
  });

  // The view here defines the template that we want to use for the model
  // This is used later on in the view for the collection to create a few for each item in the collection
  var SongView = Backbone.View.extend({
    // tagName and className set some of the defaults of the 'template'
    // They wrap the template with a 'div' here and set the class to 'songContainer'
    tagName: 'div',
    className: 'songContainer',
    // This is the actual HTML that gets wrapped inside of the tag and class above as the template
    template: $('#songTemplate').html(),

    // Actually renders the template with the model as JSON
    render: function () {
      // Uses underscore to generate the template
      var tmpl = _.template(this.template);
      // $el is actually what tagName, className, and template created
      // The variables in the HTML template are filled out with the model JSON
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    },

    // Removes the view
    deleteSong: function () {
      // Destroy the model tied to this view since we deleted it
      this.model.destroy();
      // Remove it from the HTML
      this.remove();
    },

    playSong: function() {
      $.ajax({
        url: '/spotify/' + this.model.attributes.uri,
      });
    },

    // Register an event for the delete class to run the deleteSong function of this view on click
    events: {
      'click .delete': 'deleteSong',
      'click .playSong': 'playSong'
    }
  });

  // This view encapsulates a collection
  var SongLibraryView = Backbone.View.extend({
    // Pulls in the whole songs div to use as the collections HTML element
    el: $('#songs'),

    initialize: function () {
      // Our views collection is the library model collection
      this.collection = new SongLibrary();
      this.collection.fetch();
      this.render();

      // Register event for when the collection gets added to in order to register the item that got added
      this.collection.on('add', this.renderSong, this);
      this.collection.on('reset', this.render, this);
    },

    render: function () {
      // Just saves the view for use out of this scope
      var thisView = this;
      // Calls renderSong for each model in the views collection of models
      _.each(this.collection.models, function(item) {
        thisView.renderSong(item);
      }, this);
    },

    // Takes data from all the input elements and their values to create the JSON object in the collection
    addSong: function (e) {
      // Prevents page post back
      e.preventDefault();
      var formData = {};

      // Under the addSong div, grab each child of type input
      $('#addSong div').children('input').each(function (i, el) {
        // If that inputs item is not blank, set it to the value given
        // Otherwise it will maintain the model's default value given above
        if ($(el).val() !== '') {
          formData[el.id] = $(el).val();
        }
      });

      // Actually add the item into our collection of items in backbone
      console.log(formData);
      this.collection.create(formData);
    },

    // Actually renders the song by creating a new view
    renderSong: function (item) {
      var songView = new SongView({
        model: item
      });
      this.$el.append(songView.render().el);
    },

    events: {
      'click #add': 'addSong',
    }
  });

  var songLibraryView = new SongLibraryView();
  var spotifyResultLibraryView = new SpotifyResultLibraryView();
})(jQuery);
