require('dotenv').config();
"use strict";
const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const path = require('path');
const cookieSession = require('cookie-session');
const sassMiddleware = require('node-sass-middleware');
const bcrypt = require('bcrypt');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: ['super top secret key']
}));

app.use(sassMiddleware({
  src: __dirname + "/../public",
  dest: path.join(__dirname, '/..', 'public'),
  debug: true,
}));

const {MongoClient} = require("mongodb");
const MONGODB_URI = process.env.MONGODB_URI;

MongoClient.connect(MONGODB_URI, (err, db) => {

  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const DatabaseCRUD = require("./lib/data-helpers.js")(db);

  const tweetsRoutes = require("./routes/tweets.js")(DatabaseCRUD);

  app.use("/tweets", tweetsRoutes);

  app.listen((process.env.PORT || PORT), () => {
    console.log("Example app listening on port " + PORT);
  });

});
