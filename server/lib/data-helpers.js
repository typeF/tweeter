"use strict";
const { ObjectId } = require('mongodb');

module.exports = function DatabaseCRUD(db) {
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
      db.collection("users").findOne({$or: [{"username": user.username},{"email":user.email}]}, (err, result) => {
        if (result === null){
          db.collection("users").insertOne(user);
          callback (true);
        } else {
          callback (false);
        }
      });
    },

    // Updates a like
    updateLike: function(userID, likedBefore, documentID, callback){
      if (likedBefore){
        db.collection("tweets").updateOne({ _id : ObjectId(documentID)}, {$inc: {"likeCount":-1}});
        db.collection("tweets").updateOne({_id : ObjectId(documentID)}, {$pull: {"likedUsers":userID}},
          db.collection("tweets").find().toArray((err, tweets) => {
            callback(null, tweets);
          }));
      } else {
        db.collection("tweets").updateOne({ _id : ObjectId(documentID)}, {$inc: {likeCount:1}});
          db.collection("tweets").update({_id : ObjectId(documentID)}, {$push: {"likedUsers":userID}},
            db.collection("tweets").find().toArray((err, tweets) => {
            callback(null, tweets);
          }));
      }

    },

    loginStatus: function(userID,callback){
      if (userID === undefined){
        return callback (null, false);
      }
      db.collection("users").findOne({"userID":userID},(err, result) => {
        if (result === null){
          callback(null, false);
        } else {
          callback(null, true);
        }
      });
    },

    checkPreviousLike: function(user, likeID, callback){
      db.collection("tweets").findOne({$and: [{ _id : ObjectId(likeID)},{"likedUsers":user}]}, (err, result) => {
        if (result === null){
          callback(null, false);
        } else {
          callback(null, true);
        }
      });
    },

    retrieveUser: function (userID, callback){
      db.collection("users").findOne({$or: [{"userID":userID}, {"username":userID.username}]}, (err, result) => {
        callback(err, result);
      });
    },

    generateRandomID: function(){
      return Math.random().toString(16).slice(9);
    }

  }
}


