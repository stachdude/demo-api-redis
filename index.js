var ip = require('ip');
var redis = require('redis');
var restify = require('restify');

var db = redis.createClient({ host: process.env.REDIS_HOST || '0.0.0.0' });
var server = restify.createServer({
  name: 'demo'
});

db.on('error', (err) => {
  console.log("Redis Error " + err)
});

var message = process.env.MESSAGE || 'Hello, world';

server.get('/', function (req, res, next) {
  db.incr('hits', function (err, result) {
    if (err) {
      return next(err);
    }
    var s = `${message} ${ip.address()}! ${result} hits.`;
    console.log(s);
    res.send(200, s);
    return next();
  });
});

const PORT = +(process.env.LISTEN_PORT) || 9000;
server.listen(PORT, function () {
  console.log("Listening on port %s", PORT);
});
