var express = require('express');
var app = express();

app.use(express.static('public'));

app.post('/', function (req, res) {
   res.send(req.query.username);
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});