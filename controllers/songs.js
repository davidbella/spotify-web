var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('spotify-node', server);

db.open(function (err, db) {
  if (err) throw err;
});

exports.findAll = function (req, res) {
  db.collection('songs', function (err, collection) {
    collection.find().toArray(function (err, items) {
      res.send(items);
    });
  });
};

exports.findById = function (req, res) {
  var id = req.params.id;

  db.collection('songs', function (err, collection) {
    collection.findOne({ '_id': new BSON.ObjectID(id) }, function (err, item) {
      res.send(item);
    });
  });
};

exports.addSong = function (req, res) {
  var song = req.body;

  db.collection('songs', function (err, collection) {
    collection.insert(song, {safe: true}, function (err, result) {
      if (err) {
        res.send({'error': 'an error has occurred'});
      }
      else {
        res.send(result[0]);
      }
    });
  });
};

exports.updateSong = function (req, res) {
  var id = req.params.id;
  var song = req.body;

  db.collection('songs', function (err, collection) {
    collection.update({ '_id': new BSON.ObjectID(id) }, song, {safe: true}, function (err, result) {
      if (err) {
        res.send({'error': 'an error has occurred'});
      }
      else {
        res.send(song);
      }
    });
  });
};

exports.deleteSong = function (req, res) {
  var id = req.params.id;

  db.collection('songs', function (err, collection) {
    collection.remove({ '_id': new BSON.ObjectID(id) }, {safe: true}, function (err, result) {
      if (err) {
        res.send({'error': 'an error has occurred'});
      }
      else {
        res.send(req.body);
      }
    });
  });
};