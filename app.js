const express = require('express');
const app = express();
const tinyreq = require('tinyreq');
const fs = require('fs');
const jsdom = require('jsdom');
const main = require('./app_content/js/main.js');
const splitter = require('./app_content/js/splitter.js');

app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.write('JSON file saved...');
  var Main = new main(tinyreq, jsdom, fs, res);
  Main.Splitter = new splitter();
  Main.init();
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

