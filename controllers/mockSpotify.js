var result = [
{
  'artist': 'Burial',
  'title': 'Archangel',
  'album': 'Untrue',
  'uri': 'spotify-uri'
},
{
  'artist': 'Hot Chip',
  'title': 'Look At Where We Are',
  'album': 'In Our Heads',
  'uri': 'spotify-uri'
},
];

exports.search = function (req, res) {
  res.end(JSON.stringify(result, null, 2));
};