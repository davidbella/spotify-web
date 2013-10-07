var express = require('express'),
    song = require('./controllers/songs');//,
    spotify = require('./controllers/spotify');

var path = require('path');

var app = express();

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function (req, res) {
  res.end('Hello Musitocracy!');
});

app.get('/songs', song.findAll);
app.get('/songs/:id', song.findById);
app.post('/songs', song.addSong);
app.put('/songs/:id', song.updateSong);
app.delete('/songs/:id', song.deleteSong);

app.get('/spotify', spotify.search);
app.get('/spotify/:uri', spotify.play);

app.listen(5002);