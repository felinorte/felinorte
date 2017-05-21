$("#sobre").click(function () {
    $('html,body').animate({
        scrollTop: $("#descrip").offset().top
    }, 2000);
});
$("#contacto").click(function () {
    $('html,body').animate({
        scrollTop: $("#footer").offset().top
    }, 2000);
});