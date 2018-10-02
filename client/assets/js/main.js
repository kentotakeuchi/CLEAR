// Variable to store HTML element references, for greater code clarity.
var ELEM = {};
searchText;

// Perform tasks that are dependent on the HTML being rendered (being 'ready').
$('document').ready(function() {
    // Capture HTML element references.
    getElementReferences();

    // Set event handlers.
    setEventHandlers();
});

// Capture HTML element references.
function getElementReferences() {
    // Register and login links.
    ELEM.registerCtrl = $('#registerCtrl');
    ELEM.loginCtrl = $('#loginCtrl');
    ELEM.joinLoginCtrl = $('#joinLoginCtrl');

    // User register modal.
    ELEM.registerUserModal = $('#registerUserModal');
    ELEM.registerModalErrorMessageContainer = $('#registerModalErrorMessageContainer');
    ELEM.registerModalErrorMessage = $('#registerModalErrorMessage');
    ELEM.registerEmailInput = $('#registerEmailInput');
    ELEM.registerPasswordInput = $('#registerPasswordInput');
    ELEM.registerPasswordConfirmInput = $('#registerPasswordConfirmInput');
    ELEM.loginLink = $('#loginLink');
    ELEM.registerBtn = $('#registerBtn');

    // User login modal.
    ELEM.loginUserModal = $('#loginUserModal');
    ELEM.loginModalErrorMessageContainer = $('#loginModalErrorMessageContainer');
    ELEM.loginModalErrorMessage = $('#loginModalErrorMessage');
    ELEM.loginEmailInput = $('#loginEmailInput');
    ELEM.loginPasswordInput = $('#loginPasswordInput');
    ELEM.registerLink = $('#registerLink');
    ELEM.loginBtn = $('#loginBtn');
}

// Set event handlers.
function setEventHandlers() {

    ELEM.registerLink.click(registerClickHandler);
    ELEM.loginLink.click(loginClickHandler);
    ELEM.joinLoginCtrl.click(joinLoginClickHandler);

    ELEM.registerEmailInput.change(checkRegisterData);
    ELEM.registerEmailInput.keyup(checkRegisterData);
    ELEM.registerPasswordInput.change(checkRegisterData);
    ELEM.registerPasswordInput.keyup(checkRegisterData);
    ELEM.registerPasswordConfirmInput.change(checkRegisterData);
    ELEM.registerPasswordConfirmInput.keyup(checkRegisterData);
    ELEM.registerBtn.click(registerUserHandler);
    // Ensure when the modal appears cursor is in email field.
    ELEM.registerUserModal.on('shown.bs.modal', function () {
        ELEM.registerEmailInput.trigger('focus')
    });

    ELEM.loginEmailInput.change(checkLoginData);
    ELEM.loginEmailInput.keyup(checkLoginData);
    ELEM.loginPasswordInput.change(checkLoginData);
    ELEM.loginPasswordInput.keyup(checkLoginData);
    ELEM.loginBtn.click(loginUserHandler);
    // Ensure when the modal appears cursor is in email field.
    ELEM.loginUserModal.on('shown.bs.modal', function () {
        ELEM.loginEmailInput.trigger('focus')
    });
}

// Handler for link clicked to show the user register modal.
function registerClickHandler() {
    // Fields should be blank when modal opens.
    resetValues();

    // Reset modal messages.
    resetModalMessages();

    // Close the login modal and show the register modal.
    ELEM.loginUserModal.modal('toggle');
    ELEM.registerUserModal.modal('toggle');
}

// Handler for link clicked to show the user login modal.
function loginClickHandler() {
    // Fields should be blank when modal opens.
    resetValues();

    // Reset modal messages.
    resetModalMessages();

    // Close the register modal and show the login modal.
    ELEM.registerUserModal.modal('toggle');
    ELEM.loginUserModal.modal('toggle');
}

// Handler for button clicked to show the user login modal.
function joinLoginClickHandler() {
    // Fields should be blank when modal opens.
    resetValues();

    // Reset modal messages.
    resetModalMessages();

    // Show the modal.
    ELEM.loginUserModal.modal('toggle');
}

// Handler to register user.
function registerUserHandler () {
    // Temporarily capture data from modal.
    var email = ELEM.registerEmailInput.val();
    var password = ELEM.registerPasswordInput.val();

    // Call server API to register the user.
    registerUser(email, password);
}

// Handler to login user.
function loginUserHandler () {
    // Temporarily capture data from modal.
    var email = ELEM.loginEmailInput.val();
    var password = ELEM.loginPasswordInput.val();
    

    // Reset modal messages.
    resetModalMessages();        

    // Call server to see if email is already registered.

    // Call server API to login the user.
    loginUser(email, password);
}

function registerUser() {
    console.log('registering user');
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/register",
        data: {
             email: ELEM.registerEmailInput.val(), 
             password: ELEM.registerPasswordInput.val() 
            }
        })
        .done(function( msg ) {
          alert( "Registration succeeded: " + msg );
        });
}

function loginUser() {
    console.log('logging in user');
}

function checkRegisterData() {
    if (!registerEmailValid(ELEM.registerEmailInput.val()) ||
        !registerPasswordFormatCorrect(ELEM.registerPasswordInput.val())  || 
        ELEM.registerEmailInput.val() === '' ||
        ELEM.registerPasswordInput.val() === '' ||
        ELEM.registerPasswordConfirmInput.val() === '' ||        
        !registerPasswordsMatch(
            ELEM.registerPasswordInput.val(),
            ELEM.registerPasswordConfirmInput.val()
        )   
    ) {
        ELEM.registerBtn.prop('disabled', true);
    } else {
        ELEM.registerBtn.prop('disabled', false);
    }
}

function checkLoginData() {
    if (!loginEmailValid(ELEM.loginEmailInput.val()) ||
        ELEM.loginEmailInput.val() === '' ||
        ELEM.loginPasswordInput.val() === ''
    ) {
        ELEM.loginBtn.prop('disabled', true);
    } else {
        ELEM.loginBtn.prop('disabled', false);
    }
}

function resetValues() {
    ELEM.registerEmailInput.val('');
    ELEM.registerPasswordInput.val('');
    ELEM.registerPasswordConfirmInput.val('');

    ELEM.loginEmailInput.val('');
    ELEM.loginPasswordInput.val('');

    checkRegisterData();
    checkLoginData();
}

function resetModalMessages() {
    ELEM.registerModalErrorMessageContainer.css('display', 'none');
    ELEM.registerModalErrorMessageContainer.removeClass('dangerColor warningColor infoColor okColor');
    ELEM.registerModalErrorMessage.html('');
    ELEM.loginModalErrorMessageContainer.css('display', 'none');
    ELEM.loginModalErrorMessageContainer.removeClass('dangerColor warningColor infoColor okColor');
    ELEM.loginModalErrorMessage.html('');
}

function registerEmailValid(emailAddress) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var valid = true;

    if (emailAddress.length > 0) {
        valid = re.test(String(emailAddress).toLowerCase());
    }

    if (!valid) {
        ELEM.registerModalErrorMessageContainer.addClass('dangerColor');
        ELEM.registerModalErrorMessage.html('Email format is incorrect.');
        ELEM.registerModalErrorMessageContainer.css('display', 'inline-block');
    } else {
        resetModalMessages();
    }

    return valid;
}

function registerPasswordsMatch(password1, password2) {
    var valid = password1 === password2;

    if (!valid) {
        ELEM.registerModalErrorMessageContainer.addClass('dangerColor');
        ELEM.registerModalErrorMessage.html('Password and confirm password fields do not match.');
        ELEM.registerModalErrorMessageContainer.css('display', 'inline-block');
    } else {
        resetModalMessages();
    }

    return valid;
}

function registerPasswordFormatCorrect(password) {
    var lowerCaseRegex = /.*[a-z].*/;
    var upperCaseRegex = /.*[A-Z].*/;
    var numberRegex = /.*\d.*/;
    var symbolRegex = /.*[!@#$%^&*+?].*/;
    var valid = true;
    
    if (password.length > 0) {
        valid = password.length >= 8 &&
        lowerCaseRegex.test(String(password)) &&
        upperCaseRegex.test(String(password)) &&
        numberRegex.test(String(password)) &&
        symbolRegex.test(String(password));
    }

    if (!valid) {
        ELEM.registerModalErrorMessageContainer.addClass('dangerColor');
        ELEM.registerModalErrorMessage.html('Password must be at least 8 characters in length, and must have at least one number, one uppercase letter, one lowercase letter, and one of the following symbols: ! @ # $ % ^ & * + ?');
        ELEM.registerModalErrorMessageContainer.css('display', 'inline-block');
    } else {
        resetModalMessages();
    }

    return valid;
}

function loginEmailValid(emailAddress) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var valid = true;

    if (emailAddress.length > 0) {
        valid = re.test(String(emailAddress).toLowerCase());
    }

    if (!valid) {
        ELEM.loginModalErrorMessageContainer.addClass('dangerColor');
        ELEM.loginModalErrorMessage.html('Email format is incorrect.');
        ELEM.loginModalErrorMessageContainer.css('display', 'inline-block');
    } else {
        resetModalMessages();
    }

    return valid;
}