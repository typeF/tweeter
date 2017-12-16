$(document).ready(function (){
  $(".new-tweet").on('input', 'textarea', function(event) {
    const counter = 140 - $(this).val().length;
    let counterButton = $(this).parent().parent().find('.counter');
    counterButton.text(counter);
    if (counter < 0){
      counterButton.css({'color':'red'});
    } else {
      counterButton.css({'color':'black'});
    }
  });
});