"use strict";

// Simulates the kind of delay we see with network or filesystem operations

const { ObjectId } = require('mongodb');

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {

  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    },


    // Saves a user
    saveUser: function(user, callback){
      db.collection("users").insertOne(user);
    },

    // Updates a like
    updateLike: function(documentID, callback){//, callback){
      console.log(documentID);
      db.collection("tweets").updateOne({ _id : ObjectId(documentID)}, {$inc: {likeCount:1}},
        db.collection("tweets").find().toArray((err, tweets) => {
          callback(null, tweets);
        }));

    },

    loginStatus: function(query,callback){
      console.log(query);
      if (query === undefined){
        return callback (null, false);
      }
      db.collection("users").findOne({"userID":query}, function(err, result){
        console.log(result);
        if (query === result.userID){
          callback(null, true);
        } else {
          callback(null, false);
        }
      });
    },


    generateRandomID: function(){
      return Math.random().toString(16).slice(9);
    },

    checkLogin: function(loginInfo, callback) {
      db.collection("users").find().toArray((err, users) => {
        if (err) {
          return callback(err);
        }
        callback(null, users);
      });
    },

    incrementLikes: function (){

    }

  };
}

