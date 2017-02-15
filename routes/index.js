var express = require('express');
var router = express.Router();
var twit = require('twit'); //module for interacting with Twitter API
var config = require('../config/config'); //config.js contains keys for twitter API access
var mongodb = require('mongodb');

var T = twit(config.twitter); //twitter config

//max get requests is 1 every 5 seconds
function checkLimit(key) {
  switch(key) {
    case 'search':
      T.get('application/rate_limit_status', function(err, data, response) {
        console.log(data.resources.search);
      });
      break;
    case 'users':
      T.get('application/rate_limit_status', function(err, data, response) {
        console.log(data.resources.users);
      });
      break;
    default:
      console.log('invalid input: ' + key);

  }

}

////////////////
//    GET
////////////////
//always initialize variable, otherwise they are undefined variables
var tweetData = [];
//sample Twitter API function to get tweet broken down into its components
//adds one tweet to twitter.movies collection in mongoDB each time it is called
function getTweetSample() {
    //q is the query term parameter
    //get 10 latest tweets since 2011-11-11
    //go to the below link for a list of search params
    //https://dev.twitter.com/rest/reference/get/search/tweets
    var getParams = {
      q: 'movie since:2011-11-11',
      count: 1
    }
    function gotData(err, data, response) {
      var MongoClient = mongodb.MongoClient;
      var mongoDB_URL = config.mongodb.url;
      var tweets = data.statuses;

      MongoClient.connect(mongoDB_URL,function(err, db){
        if(err){
          console.log("Unable to connect, error: ", err);
          res.send(err);

        } else {
          var collection = db.collection('movies');
          collection.insert(tweets, function(err, result){
            if(err){
              console.log(err);
            } else {
              console.log('succesful insertion');
            }
            db.close();
          });
        }

      });
      /*
      tweets.forEach(function(t){
        tweetData.push(t.text);
        console.log('TWEET: ' + t.text);
      });
      console.log(data);
      */
    };
    //search request
    //params: what to search for
    //gotData: callback function called once data is retrieved
    T.get('search/tweets', getParams, gotData);
}

//updates one tweet over and over again.
function updateTweetSample() {
    var getParams = {
      q: 'movie since:2011-11-11',
      count: 1
    }
    function gotData(err, data, response) {
      var MongoClient = mongodb.MongoClient;
      var mongoDB_URL = config.mongodb.url;
      var tweets = data.statuses;

      MongoClient.connect(mongoDB_URL,function(err, db){
        if(err){
          console.log("Unable to connect, error: ", err);
          res.send(err);

        } else {
          var collection = db.collection('movies');
          collection.update({}, data, {upsert:true});
          db.close();
        }
      });
    };
    T.get('search/tweets', getParams, gotData);
}



getTweetSample();
//setInterval(function(){checkLimit('search');}, 1000*10);
//checkLimit('search'); //gets how many API calls you have left for the current 15 minutes

////////////////
//   STREAM
////////////////
//filter public stream by English tweets containing #apple
//var stream = T.stream('statuses/filter', {track: '#apple', language: 'en'});
//whenever there is a tweet with the above stream parameters, the callback
//function is executed
/*
stream.on('tweet', function(tweet) {
  console.log(tweet);
});
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    tweetText: tweetData});
});

module.exports = router;
