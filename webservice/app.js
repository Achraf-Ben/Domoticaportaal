var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

// haal de routes van de gebruikers en modules op
var users = require('./routes/users');
var modules = require('./routes/modules');

var app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configureer express om een cookie session te gebruiken
app.use(cookieParser());
app.use(session({ 
  secret: 'vewysecwetpassfwase', 
  resave: true,
  saveUninitialized: true
}));

// Express configureren om alles in de public map toegankelijk te maken over HTTP
app.use(express.static(path.join(__dirname, './public')))

// Express configureren om de groutes van de gebruikers en modules te gebruiken
app.use('/api/users', users);
app.use('/api/modules', modules);

// Bij alle andere routes wordt de webportaal teruggestuurd.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

module.exports = app;
