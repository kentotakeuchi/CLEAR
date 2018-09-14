/**
 * Transition between join and login
 */

$(function() {
    // Showing Join Modal
    $("#join_modal").click(toggleLoginJoin);

    // Showing Login Modal
    $("#login_modal").click(toggleLoginJoin);

    function toggleLoginJoin () {
        $('.loginModal').modal('toggle');
        $('.joinModal').modal('toggle');
    }
});


/**
 * Input(login, join) --> console.log with js
 */

// Global
var lgEmailInput = document.getElementById('login-email');
var joinEmailInput = document.getElementById('join-email');
var pwdInput = document.getElementById('pwd');

/*
// Click login button
document.querySelector('.lg-btn').addEventListener('click', function(event) {
    event.preventDefault();
    var email = lgEmailInput.value;
    var password = pwdInput.value;
    console.log("email", email);
    console.log("password", password);
});

// Click join button
document.querySelector('.join-btn').addEventListener('click', function(event) {
    event.preventDefault();
    var email = joinEmailInput.value;
    var password = pwdInput.value;
    console.log("email", email);
    console.log("password", password);
});
*/

/**
 * Input --> console.log with jquery
 */

$(function() {
    // Showing Join Modal
    $("#lg-btn").click(function() {
        var email = lgEmailInput.value;
        var password = pwdInput.value;
        console.log("email", email);
        console.log("password", password);
    });

    // Showing Login Modal
    $("#join-btn").click(function() {
        var email = joinEmailInput.value;
        var password = pwdInput.value;
        console.log("email", email);
        console.log("password", password);
    });

});


