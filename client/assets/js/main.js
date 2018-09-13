/**
 * Transition between join and login
 */

$(function() {
    // Calling Join Modal
    $("#join_modal").click(toggleLoginJoin);

    // Calling Login Modal
    $("#login_modal").click(toggleLoginJoin);

    function toggleLoginJoin () {
        $('.loginModal').modal('toggle');
        $('.joinModal').modal('toggle');
    }
    // $('#join_modal').on('hidden.bs.modal', function () {
    //     alert('hidden event fired!');
    // });

    // $('#join_modal').on('shown.bs.modal', function () {
    //     alert('show event fired!');

});


/**
 * Input(login, join) --> console.log with js
 */

// Global
var lgEmailInput = document.getElementById('login-email');
var joinEmailInput = document.getElementById('join-email');
var pwdInput = document.getElementById('pwd');

// Click login button
document.querySelector('.lg-btn').addEventListener('click', function(event) {
    event.preventDefault();
    console.log(lgEmailInput.value, pwdInput.value);
});

// Click join button
document.querySelector('.join-btn').addEventListener('click', function(event) {
    event.preventDefault();
    console.log(joinEmailInput.value, pwdInput.value);
});

/**
 * Input --> console.log with jquery
 */




