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

  // Like a tweet
  $("#tweets").on('click', ".heart", function(event){
    const tweetUserID = $(this).data("tweetUserID");
    const likeID = $(this).data("likes");
      $.ajax({
        url: "/tweets/like",
        method: "POST",
        data: {"likeID":likeID, "tweetUserID":tweetUserID}
      }).done(getTweets);
  });

  $("#nav-bar").on('click', ".logout", function(event){
    $.ajax({
      url: "/tweets/logout",
      method: "POST",
    }).done(function(){
        $('.logout').hide();
        $('.new-tweet').hide();
        $('.compose').hide();
        $('.heart').hide();
        $('.retweet').hide();
        $('.login').show();
        $('.register').show();
    });
  });

  $("body").on('click', ".login", loginAjax);
  $("body").on('click', ".register", registrationAjax);

  $('.logout').hide();
  $('.new-tweet').hide();
  $('.compose').hide();

  getTweets();
  checkIsLoggedIn();
});

function getTweets () {
    $.ajax({
      url: "/tweets",
      method: "GET",
      data: $(this).serialize()
    }).done(function(tweets){
        $("textarea").val("");
        $(".counter").text("140");
        renderTweets(tweets);
    });
}

function renderTweets(data){
  $("#tweets").empty();
  for (let users in data){
    $("#tweets").prepend(createTweetElement(data[users]));
  }
  return
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
      var $date = $("<p>").addClass("date_created").text(data.created_at);
      var $imgf = $("<img src='https://png.icons8.com/destination/androidL/30/000000'>").addClass("footer-icon");
      var $imgrt = $("<img src='https://png.icons8.com/retweet/win10/30/000000'>").addClass("footer-icon retweet");
      var $imghrt = $("<img src='https://png.icons8.com/heart/win10/30/000000'>").addClass("footer-icon heart").data("likes",data._id).data("tweetUserID",data.userID);
      var $likes = $("<span>").addClass("likes").text(data.likeCount);

      var $div = $("<div>").append($likes, $imgf, $imgrt, $imghrt).addClass("tweet-actions");

    $footer.append($date, $div);

  $tweetings.append($header, $tweet, $footer);
  return $tweetings
}

function registrationAjax(){
  $.ajax({
    url: "registration.html",
    method: "GET",
  }).done(function(registrationHTML){
    $('main').empty();
    $('main').append(registrationHTML);
  });
}

function loginAjax(){
  $.ajax({
    url: "login.html",
    method: "GET",
  }).done(function(loginHTML){
    $('main').empty();
    $('main').append(loginHTML);
  });
}

function checkIsLoggedIn(){
  $.ajax({
    url: '/tweets/isLoggedIn',
    method: 'GET'
  }).done(function(isLoggedIn){
    if(isLoggedIn) {
      $('.compose').show();
      $('.logout').show();
      $('.heart').show();
      $('.retweet').show();
      $('.login').hide();
      $('.register').hide();
    }
  });
}

function composeSlider(){
  $(".new-tweet").slideToggle();
  $('textarea').focus();
 }

function errorHandling (){
  const textarea = $("textarea").val();
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
