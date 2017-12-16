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
      var $imgrt = $("<img src='https://png.icons8.com/refresh/p1em/30/000000'>").addClass("footer-icon");
      var $imghrt = $("<img src='https://png.icons8.com/heart-outline/android/30/000000'>").addClass("footer-icon heart").data("likes",data._id);
      var $likes = $("<span>").addClass("likes").text(data.likeCount);

      var $div = $("<div>").append($likes, $imgf, $imgrt, $imghrt).addClass("tweet-actions");

    $footer.append($date, $div);

  $tweetings.append($header, $tweet, $footer);
  return $tweetings
}

console.log("HI");

function renderTweets(data){
  $("#tweets").empty();
  for (let users in data){
    $("#tweets").prepend(createTweetElement(data[users]));
  }

  return
}

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

  $("#tweets").on('click', ".heart", function(event){
    let likeID = $(this).data("likes");
    console.log(likeID);
        $.ajax({
        url: "/tweets/like",
        method: "POST",
        data: {"likeID":likeID}
      }).done(getTweets);
  });

  $("#nav-bar").on('click', ".logout", function(event){
    console.log("clicked logout");
    $.ajax({
      url: "/tweets/logout",
      method: "POST",
    }).done(function(){
        $('.logout').hide();
        $('.new-tweet').hide();
        $('.compose').hide();
        $('.login').show();
        $('.register').show();
    });
  });

  $("body").on('click', ".login", loginAjax);
  $("body").on('click', ".register", registrationAjax);

  getTweets();
  $('.logout').hide();
  $('.new-tweet').hide();
  $('.compose').hide();

  checkIsLoggedIn();

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
  $(".new-tweet").slideToggle();
  $('textarea').focus();
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

function registrationAjax(){
  $.ajax({
    url: "registration.html",
    method: "GET",
  }).done(function(registrationHTML){
    $('main').empty();
    $('main').append(registrationHTML);
  });
}

function checkIsLoggedIn(){
  $.ajax({
    url: '/isLoggedIn',
    method: 'GET'
  }).done(function(isLoggedIn){
    if(isLoggedIn) {
      $('.compose').show();
      $('.logout').show();
      $('.login').hide();
      $('.register').hide();
    }
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
