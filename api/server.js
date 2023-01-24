// Dependencies
const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
// Files
const {db} = require("./src/db");
const {HOST} = process.env;
const routes = require('./src/routes/index.js');


// Middlewares
server.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
server.use(bodyParser.json({limit: '50mb'}));
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Routes
server.use('/', routes);

// Server starter
server.listen(HOST, () => {
  console.log(`Listening on port ${HOST}`);
  db.sync({force: false})
  .then(console.log("Tables done"));
});