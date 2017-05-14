$('.toggle').on('click', function() {
  $('.login-wrapper').stop().addClass('active');
});

$('.close').on('click', function() {
  $('.login-wrapper').stop().removeClass('active');
});