"use strict";

const userHelper    = require("../lib/util/user-helper")
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express       = require('express');
const app = express();
const tweetsRoutes  = express.Router();



module.exports = function(DataHelpers) {

  tweetsRoutes.post("/register", function (req, res){
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordHashed = bcrypt.hashSync(password, 10);

    const userID = DataHelpers.generateRandomID();
    req.session.userID = userID;

    const user = {
      userID: userID,
      username: username,
      name: name,
      email: email,
      password: passwordHashed
    }

    DataHelpers.saveUser(user);
    res.redirect('/');
  });


  // Updates likes
  tweetsRoutes.post("/like", function (req, res){
    const likeID = req.body.likeID;
    DataHelpers.updateLike(likeID, function(err){
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.send();
      }
    }); //, function (err){

  });

  tweetsRoutes.post("/loginStatus", function (req, res){
    DataHelpers.loginStatus(req.session.userID, function(err, result){
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log("result is: " + result);
        return (result);
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
    DataHelpers.checkLogin(loginInfo, function(err,users) {
        if (err) {
         res.status(500).json({ error: err.message });
        } else {
          for (let user in users){
            if (users[user].username === username ){
             if (users[user].username === username && bcrypt.compareSync(password,users[user].password)) {
              req.session.userID = users[user].userID;
              res.redirect('/');
              return
             }
            }
          }
        res.status(403).send('Invalid e-mail or password');
        return;
      }
    });
  });

  // Get tweets route
  tweetsRoutes.get("/", function(req, res) {

    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });

  });

  // Save tweet route
  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const userInfo = {
      userName: "anon ymous",
      userHandle: "@anon"
    }
    const user = req.body.user ? req.body.user : userHelper.generateRandomUser(userInfo);
    const tweet = {
      user: user,
      likeCount: 0,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }

    });
  });

  tweetsRoutes.post("/logout", function(req, res) {
    console.log("Logged out");
    req.session = null;
      DataHelpers.getTweets((err, tweets) => {
          if (err) {
            res.status(500).json({ error: err.message });
         } else {
            res.json(tweets);
         }
        });
      });

  return tweetsRoutes;

}



//   tweetsRoutes.post("/register", function (req, res){
//     const username = req.body.username;
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.password;
//     const passwordHashed = bcrypt.hashSync(password, 10);

//     DataHelpers.checkLogin(user, function (users){
//       for (let userID in users){
//         if (users[userID].user.email === email){
//         res.status(400).send('Email already exists. Please enter new email');
//         return
//         }
//         if (users[userID].user.username === username){
//         res.status(400).send('Username already exists. Please enter new username');
//         return
//         }
//       }
//         if (email === "" || password === "" || username === "" || name === ""){
//           res.status(400).send('Username, name, e-mail and password fields cannot be empty');
//           return
//         } else {
//             const userID = DataHelpers.generateRandomID();
//             req.session.userID = userID;

//             const user = {
//                 user: {
//                   userID: userID,
//                   username: username,
//                   name: name,
//                   email: email,
//                   password: passwordHashed
//                 }
//             }

//             DataHelpers.saveUser(user);

//         }
//       });
// });