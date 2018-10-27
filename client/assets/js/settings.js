var token = localStorage.getItem('token');
var email = localStorage.getItem('userEmail');

$('document').ready(function() {
    loadHeader1('SETTINGS');
    loadHeader2('settingsPage');
    loadFooter();
    $('#saveProfileBtn').click(saveProfileHandler);
});

function saveProfileHandler(e) {
    e.preventDefault();

    var form = $('#profileForm').get()[0];
    var formData = new FormData(form);

    $.ajax({
        method: 'PUT',
        url: 'http://localhost:3000/users/' + email,
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'x-access-token': token },
        success: function(res) {
            console.log('Profile was successfully updated!', res);
        },
        error: function(res) {
            console.log('Fail', res);
        },
    });
}