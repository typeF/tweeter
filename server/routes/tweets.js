"use strict";

const userHelper    = require("../lib/util/user-helper")
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express       = require('express');
const tweetsRoutes  = express.Router();
const moment = require('moment');

module.exports = function(DatabaseCRUD) {

  // Get tweets route
  tweetsRoutes.get("/", function(req, res) {

    DatabaseCRUD.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/register", function (req, res){
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordHashed = bcrypt.hashSync(password, 10);

    const userID = DatabaseCRUD.generateRandomID();
    const user = {
      userID: userID,
      username: username,
      name: name,
      email: email,
      password: passwordHashed,
    }

    DatabaseCRUD.saveUser(user, function (result){
      if (result){
        req.session.userID = userID;
        res.redirect('/');
        return
      } else {
        res.status(403).send('Username or e-mail already taken');
        return
      }
    });
  });

  // Login route
  tweetsRoutes.post("/login", function (req, res){
    const username = req.body.username;
    const password = req.body.password;
    const loginInfo = {
      username: username,
      password: password
    }
    DatabaseCRUD.retrieveUser(loginInfo, function (err,userInfo) {
      if (userInfo === null){
        res.status(403).send('User not found');
        return
      }
      if (bcrypt.compareSync(password, userInfo.password)) {
        req.session.userID = userInfo.userID;
        res.redirect('/');
        return
      } else {
        res.status(403).send('Invalid password');
        return
      }
    });
  });

  // Save tweet route
  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    if (!req.session.userID) {
      res.direct('/');
      return;
    }

    const userID = req.session.userID;

    DatabaseCRUD.retrieveUser(userID, function (err,userInfo) {
      const user = userHelper.generateAvatar(userInfo);
      const tweet = {
        user: user,
        userID: req.session.userID,
        likeCount: 0,
        likedBy: "",
        content: {
          text: req.body.text
        },
        created_at: Date.now()
      };

      DatabaseCRUD.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send();
        }
      });
    });
  });

  // Updates likes
  tweetsRoutes.post("/like", function (req, res){
    const tweetUserID = req.body.tweetUserID;
    const likeID = req.body.likeID;
    const userID = req.session.userID;
    if (tweetUserID === userID){
      res.send();
    } else {
      DatabaseCRUD.checkPreviousLike(userID, likeID, function (err, result){
        DatabaseCRUD.updateLike(userID, result, likeID, function(err){
              if (err) {
                res.status(500).json({ error: err.message });
              } else {
                res.send();
              }
            });
      });
    }
  });

  tweetsRoutes.post("/loginStatus", function (req, res){
    DatabaseCRUD.loginStatus(req.session.userID, function(err, result){
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        return result
      }
    });
  });


  // Check if logged in
  tweetsRoutes.get('/isLoggedIn', (req,res, next) => {
    DatabaseCRUD.loginStatus(req.session.userID, (err, result) => {
      if(err){
        next(err);
      } else {
        res.json(result);
      }
    })
  });

  tweetsRoutes.post("/logout", function(req, res) {
    req.session = null;
      DatabaseCRUD.getTweets((err, tweets) => {
          if (err) {
            res.status(500).json({ error: err.message });
         } else {
            res.json(tweets);
         }
      });
  });

  return tweetsRoutes;
}
