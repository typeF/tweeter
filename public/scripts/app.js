/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
var tweetData = {
  "user": {
    "name": "Newton",
    "avatars": {
      "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
      "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
      "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    },
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}

function createTweetElement (data) {
  var $tweetings = $("<article>").addClass("tweet");
    var $header = $("<header>").addClass("header");
      var $img = $("<img src=" + data.user.avatars.large +">").addClass("avatar");
      var $name = $("<p>").addClass("name").text(data.user.name);
      var $handle = $("<p>").addClass("handle").text(data.user.handle);
      $header.append($img, $name, $handle);

    var $tweet = $("<p>").text(data.content.text).addClass("the-Tweet");

    var $footer = $("<footer>").addClass("footer");
      var $imgf = $("<img src=" + data.user.avatars.large +">").addClass("footer-icon");
      var $date = $("<date>").addClass("date_created").text(data.created_at);
      $footer.append($imgf, $date);

  $tweetings.append($header, $tweet, $footer);
  return $tweetings
}

function renderTweets(data){
  $("#tweets").empty();
  for (let users in data){
    $("#tweets").prepend(createTweetElement(data[users]));
  }
  return
}

renderTweets(data2);

$(document).ready(function (){
  let $tweetForm = $(".tweet-submit-form");

  $tweetForm.on('submit', function (event){
    event.preventDefault();
    if (!errorHandling()){
      return
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $(this).serialize()
      }).done(getTweets);
    }
  });

  $(".compose").on('click', composeSlider);

});

function getTweets () {
    $.ajax({
      url: "/tweets",
      method: "GET",
      data: $(this).serialize()
    }).done(function(tweets){
        console.log("AJAX Completed");
        $("textarea").val("");
        $(".counter").text("140");
        renderTweets(tweets);
    });
}

function composeSlider(){
  // $(".new-tweet").slideToggle();
  // $('textarea').focus();
  //alt ajax testing
      $.ajax({
      url: "registration.html",
      method: "GET",
    }).done(function(registrationHTML){
        console.log(registrationHTML);
        $('main').empty();
        $('main').append(registrationHTML);
    });
 }

function errorHandling (){
  const textarea = $("textarea").val();
  console.log(textarea);
  if (textarea === "" || textarea === null){
    alert('Error - Form field cannot be empty');
    return false
  }
  if (textarea.length > 140) {
    alert('Error - Tweet cannot exceed 140 characters');
    return false
  } else {
    return true
  }
}

var data2 = [
  {
    "user": {
      "name": "Newton22",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];
