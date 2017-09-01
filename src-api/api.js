var express = require('express');
var cors = require('cors');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json('*/json'));
app.use(cors({
  origin: ['http://localhost:8080','http://localhost:3000']
}));

app.use('/session', require('./routes/session.js').default);

const port = 3001;
app.listen(port, function () {
  console.log('App listening on port ' + port);
});
