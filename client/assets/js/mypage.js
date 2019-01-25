// Variable to store HTML element references, for greater code clarity.
var ELEM = {};
var searchText = '';
var saveMode = 'add';
var token = localStorage.getItem('token');
var email = localStorage.getItem('userEmail');
var name = localStorage.getItem('userName');
var userID = localStorage.getItem('user_id');

var port = location.hostname === 'localhost' ? ':3000' : '';
var clear_baseURL = 'http://' + location.hostname + port + '/api2';
console.log(`clear_baseURL`, clear_baseURL);

var baseURL = location.hostname === `www.kentotakeuchi.com` ? `http://${location.hostname}/clear` : `http://localhost:8080`;


// Perform tasks that are dependent on the HTML being rendered (being ready).
$('document').ready(function() {
    // Capture HTML element references.
    getElementReferences();

    // Set event handlers.
    setEventHandlers();

    // Get all items for current user.
    getItems();

    // Get all messages for current user.
    getMessages();

    $(document).keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchText = $('#searchInput').val();
            searchHandler(searchText, false, showEntireSearchResults);
            clearSearchHandler();
        }
    });
    $('#searchInput').keyup(function() {
        searchText = $('#searchInput').val();
        searchHandler(searchText, true, showSearchResultsSimple);
    });
});

// Capture HTML element references.
function getElementReferences() {
    ELEM.idOfItemBeingEdited = $('#idOfItemBeingEdited');
    ELEM.items = $('#items');

    // Add/Edit item modal.
    ELEM.addEditModal = $('#addEditModal');
    ELEM.modalTitle = $('.modal-title');
    ELEM.addEditModalTitle = $('#addEditModalTitle');
    ELEM.itemForm = $('#itemForm');
    ELEM.itemImg = $('#item-img');
    ELEM.itemName = $('#item-name');
    ELEM.itemDesc = $('#item-desc');
    ELEM.itemBrand = $('#item-brand');
    ELEM.itemCtg = $('#item-ctg');
    ELEM.itemCnd = $('#item-cnd');
    ELEM.addItemBtn = $('#addItemBtn');
    ELEM.saveItemBtn = $('#saveItemBtn');

    // Each item modal.
    ELEM.itemModal = $('#itemModal');
    // ELEM.modalItemId = $('#modal-item-id');
    ELEM.modalItemUserName = $('#modal-item-userName');
    ELEM.modalItemEmail = $('#modal-item-email');
    ELEM.modalItemName = $('.modal-item-name');
    ELEM.modalItemImg = $('.modal-item-img');
    ELEM.modalItemDesc = $('.modal-item-desc');
    ELEM.modalItemBrand = $('.modal-item-brand');
    ELEM.modalItemCtg = $('.modal-item-ctg');
    ELEM.modalItemCnd = $('.modal-item-cnd');

    // Message from item modal.
    ELEM.modalItemMessageContainer = $('#modal-item-messageContainer')
    ELEM.messageText = $('#messageText');
    ELEM.messageSendBtn = $('#messageSendBtn');

    ELEM.messageModalBtn = $('#messageModalBtn');

    // Message inbox.
    ELEM.messageInboxModal = $('#messageInboxModal');
    ELEM.messagesContainer = $('#messages-container');
    ELEM.messageContainer = $('#messageContainer');

    // Profile
    ELEM.profileModalBtn = $('#profileModalBtn');
    ELEM.profileModal = $('#profileModal');
    ELEM.modalProfileName = $('.modal-profile-name');
    ELEM.modalProfileEmail = $('.modal-profile-email');
    ELEM.modalProfileDob = $('.modal-profile-dob');
    ELEM.modalProfileGender = $('.modal-profile-gender');
    ELEM.modalProfileLocation = $('.modal-profile-location');
    ELEM.modalProfileDesc = $('.modal-profile-desc');
}

// Set event handlers.
function setEventHandlers() {
    ELEM.itemImg.change(checkData);
    ELEM.itemName.change(checkData);
    ELEM.itemName.keyup(checkData);
    ELEM.itemDesc.change(checkData);
    ELEM.itemDesc.keyup(checkData);
    ELEM.itemBrand.change(checkData);
    ELEM.itemBrand.keyup(checkData);
    ELEM.itemCtg.change(checkData);
    ELEM.itemCnd.change(checkData);

    ELEM.addItemBtn.click(addItemHandler);
    ELEM.saveItemBtn.click(saveItemHandler);
    ELEM.addEditModal.keypress(e => {
        if (e.keyCode === 13) {
            if (checkData()) {
                e.preventDefault();
                saveItemHandler(e);
            }
        }
    });

    ELEM.messageSendBtn.click(sendMessageHandler);
    ELEM.messageModalBtn.click(messageModalHandler);

    ELEM.profileModalBtn.click(getProfile);

    // Ensure when the modal appears cursor is in name field.
    ELEM.addEditModal.on('shown.bs.modal', function() {
        ELEM.itemName.trigger('focus');
    });
}


// Display each item's modal when user click their images.
function displayItem(event) {
    var itemID = $(event.target).parent().attr('id');
    var url = `${clear_baseURL}/items/` + userID + "/" + itemID;
    $.ajax({
        method: "GET",
        url: url,
        headers: { 'x-access-token': token },
        success: function(item) {
            showItemModal2(item);
             // Hide comment area IF the item is added by the user.
            if (item.userID === userID) {
                ELEM.modalItemMessageContainer.css('display', 'none');
            } else {
                ELEM.modalItemMessageContainer.css('display', 'block');
            }
        },
        error: function(res) {
            alert(res);
        }
    });
}


// Display all items on the mypage user searched.
function showEntireSearchResults(items) {
    // Only proceed if we have data.
    if (items) {
        $('#searchResults').empty();
        generateItems(items);
        navbarChangeHandler(items, searchText);
    }
}

// Change the title on the header-2 when user press return key.
function navbarChangeHandler(items, searchText) {
    // The info of search results.
    var listElement = `<li class="nav-item p-2 nav-search-result"><small class="text-dark">${items.length} results for "${searchText}"
    </small></li>`;

    // Clear previous search result(if there is).
    $('.nav-search-result').css('display', 'none');

    // Hide the title on the header-2.
    $('.hide').css('display', 'none');

    // Display the info of search results on the header-2.
    $('#sub-nav-ul').append(listElement);
}

// Display only name of items below the search input user searched.
function showSearchResultsSimple(items) {
    // Only proceed if we have data.
    if (items) {
        $('#searchResults').empty();
        items.forEach(function(item, index) {
            // Only proceed if the data has _id and name properties
            // & show the search results up to 7.
            if (item.hasOwnProperty('name') && index < 7) {
                var divElement = $('<div class="searchItem">' + item.name + '</div>');
                $(divElement).click(searchItemClicked);
                $('#searchResults').append(divElement);
                $('#searchResults').fadeIn(500);
                $('#searchInput').focusout(e => {
                    $('#searchResults').fadeOut(500);
                });
            }
        });
    }
}


function searchHandler(searchTerm, filter, successCallback) {
    if (searchTerm.length >= 3) {
        $.ajax({
            url: `${clear_baseURL}/items/search`,
            method: 'POST',
            headers: { 'x-access-token': token },
            data: {
                searchText: searchTerm,
                filter: filter
            },
            success: successCallback
        });
    }
}

// For search results.
function showItemModal(data) {
    $('#modal-item-userID').val(data[0].userID);
    // ELEM.modalItemId.val(data[0]._id);
    ELEM.modalItemName.val(data[0].name);
    ELEM.modalItemEmail.val(data[0].userEmail);
    ELEM.modalItemUserName.val(data[0].userName);
    ELEM.modalItemName.html('<h3>' + data[0].name + '</h3>');
    ELEM.modalItemImg.html('<img src="' + data[0].img + '" style="width:100%"></img>');
    ELEM.modalItemDesc.html('Description:   ' + data[0].desc);
    ELEM.modalItemBrand.html('Brand:          ' + data[0].brand);
    ELEM.modalItemCtg.html('Category:      ' + data[0].ctg);
    ELEM.modalItemCnd.html('Condition:     ' + data[0].cnd);
    ELEM.modalItemUserName.html(`Added by <span class="addedUserName">${data[0].userName}</span>`);

    // Hide comment area IF the item is added by the user.
    if (data[0].userID === userID) {
        ELEM.modalItemMessageContainer.css('display', 'none');
    } else {
        ELEM.modalItemMessageContainer.css('display', 'block');
    }

    ELEM.itemModal.modal('toggle');
}

// For main section.
function showItemModal2(item) {
    $('#modal-item-userID').val(item.userID);
    // ELEM.modalItemId.val(item._id);
    ELEM.modalItemName.val(item.name);
    ELEM.modalItemEmail.val(item.userEmail);
    ELEM.modalItemUserName.val(item.userName);
    ELEM.modalItemName.html('<h3> ' + item.name + '</h3>');
    ELEM.modalItemImg.html('<img src="' + item.img + '" style="width:100%"></img>');
    ELEM.modalItemDesc.html('Description: ' + item.desc);
    ELEM.modalItemBrand.html('Brand: ' + item.brand);
    ELEM.modalItemCtg.html('Category: ' + item.ctg);
    ELEM.modalItemCnd.html('Condition: ' + item.cnd);
    ELEM.modalItemUserName.html(`Added by <span class="addedUserName">${item.userName}</span>`);

    ELEM.itemModal.modal('toggle');
}

// Pop up the item modal user searched.
function searchItemClicked(event) {
    searchHandler(event.target.innerHTML, false, showItemModal);
    clearSearchHandler();
}

function clearSearchHandler() {
    $('#searchInput').val('');
    $('#searchResults').empty();
    $('#searchResults').css('display', 'none');
}

// Handler for button clicked to show the add item modal.
function addItemHandler() {
    saveMode = 'add';

    // Name and description fields should be blank when modal opens in 'add' mode.
    resetValues();
    // Avoid to display error message when modal pop up.
    $('#addEditErrorMessageContainer').css('display', 'none');

    // Set modal title to reflect we are in 'add' mode.
    ELEM.modalTitle.html('ADD ITEM');

    // Show the modal.
    ELEM.addEditModal.modal('toggle');
}

// Handler to save data from the add/edit modal.
function saveItemHandler(e) {
    e.preventDefault();
    // Temporarily capture data from modal.
    var form = ELEM.itemForm.get()[0];
    var formData = new FormData(form);
    formData.append('userEmail', email);
    formData.append('userName', name);
    formData.append('userID', userID);

    var id = ELEM.idOfItemBeingEdited.val();

    // Save the data to the data store.
    var method = saveMode === 'add' ? 'POST' : 'PUT';
    var url = `${clear_baseURL}/items`;
    if (saveMode === 'edit') {
        url += '/' + id;
    }

    $.ajax({
        method: method,
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'x-access-token': token },
        success: function(res) {
            getItems();
            // Remove search result title when user add/edit item on the search result page.
            $('.hide').css('display', 'block');
            $('.nav-search-result').remove();

            ELEM.addEditModal.modal('toggle');
        },
        error: function(res) {
            alert('fail', res);
        },
        done: function (res) {
            alert('done', done);
        },
        });
}


// Display preview image when user choose a image for uploading.
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        $('#prevImg').css('display', 'block');

        reader.onload = function (e) {
            $('#prevImg').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$('#item-img').change(function() {
    readURL(this);
    console.log('this', this);
});

// Disable/enable save button depending on
// whether or not required data has been entered.
function checkData() {
    // TODO: Make condition whether it's Add or EDIT.
    const inValid =
    ELEM.itemName.val() === '' || ELEM.itemDesc.val() === '' || ELEM.itemBrand.val() === '' || ELEM.itemCtg.val() === null || ELEM.itemCnd.val() === null;
    if (inValid) {
        ELEM.saveItemBtn.prop('disabled', true);

        $('#addEditErrorMessageContainer').addClass('dangerColor');
        $('#addEditErrorMessage').html('Please fill out all fields');
        $('#addEditErrorMessageContainer').css('display', 'block');
    } else {
        ELEM.saveItemBtn.prop('disabled', false);

        clearErrorMessage();
    }
    return !inValid;
}

function clearErrorMessage() {
    $('#addEditErrorMessageContainer').removeClass('dangerColor');
    $('#addEditErrorMessage').html('');
    $('#addEditErrorMessageContainer').css('display', 'none');
}

// Get all items for current user.
function getItems() {
    $.ajax({
        method: "GET",
        url: `${clear_baseURL}/items/` + userID,
        headers: { 'x-access-token': token },
        success: function(items) {
            generateItems(items);
        }
    });
}

// Generate items for data available when page is rendered.
function generateItems(items) {
    // First wipe out the items in the UI so we don't add duplicates.
    ELEM.items.empty();

    // Operate on each data item we have.
    items.forEach(function(item) {
        // We create the new item top-level div based on the item id in the data.
        var divElement = $('<div class="item" id="' + item._id + '"></div>');

        // Create a div that will hold the edit and delete icons.
        var toolsContainer = $('<div class="tools-container d-flex justify-content-end"></div>');

        // Create the edit and delete icon.
        var removeIcon = '<i class="fa fa-times" aria-hidden="true" id="removeIcon"></i>';
        var editIcon = '<i class="fas fa-pen editIcon" data-toggle="modal" data-target="#editItemModal" id="editIcon"></i>';

        // Add the edit and delete icon to the tools container.
        toolsContainer.append(editIcon);
        toolsContainer.append(removeIcon);

        // Create the UI elements for the new item,
        // setting their data from the item data.
        var width = getRandomSize(300, 500);
        var height =  getRandomSize(300, 500);
        var imgElement = '<img class="itemImg grow" src="' + item.img + '" width="' + width + '" height="' + height + '"></img>';

        var nameElement = '<p class="itemName">' + item.name + '</p>';

        divElement.attr('data-img', item.img);
        divElement.attr('data-desc', item.desc);
        divElement.attr('data-brand', item.brand);
        divElement.attr('data-ctg', item.ctg);
        divElement.attr('data-cnd', item.cnd);

        // Add the tools container to the item top-level div.
        divElement.append(toolsContainer);

        // Add the item elements to the item top-level div.
        divElement.append(imgElement);
        divElement.append(nameElement);

        // Add the item top-level div to the items container div.
        ELEM.items.append(divElement);

        // Set click handlers for the delete and edit icons.
        $('#' + item._id).find('#removeIcon').click(removeItem);
        $('#' + item._id).find('#editIcon').click(editItemHandler);

        // TODO: Probably this code is not here.
        // Hide edit/delete icon IF the item was not created by the user.
        if (item.userID !== userID) {
            $('.tools-container').css('cssText', 'visibility: hidden !important;');
        }
    });
    $('.itemImg').click(displayItem);
}

// Display item images in random size.
function getRandomSize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

// Handler for item icon clicked to delete an item.
// TODO add code to confirm if user wants to delete
// the item, and only proceed if they click yes.
function removeItem(event) {
    if (confirm("Are you sure?")) {
        // Walk up the DOM from the delete icon (event.target)
        // to get to the item top-level div, which has the
        // item's id set on it.
        var itemToRemove = $(event.target).parent().parent();

        // Get the item's id value.
        var idOfItemToRemove = $(itemToRemove).attr('id');

        $.ajax({
            method: 'DELETE',
            url: `${clear_baseURL}/items/` + idOfItemToRemove,
            headers: { 'x-access-token': token },
            success: function() {
                // Regenerate items and now the deleted item will not appear,
                // because we removed the data for the item to remove.
                getItems();
            }
            })
            .done(function( msg ) {
              alert( "Deleting item succeeded: " + msg );
            });
    }
    return false;
}

// Handler for item icon clicked to edit an item.
function editItemHandler(event) {
    saveMode = 'edit';

    // Set modal title to reflect we are in 'edit' mode.
    ELEM.addEditModalTitle.html('EDIT ITEM');


    // Get a reference to the current item top-level div.
    var itemToEdit = $(event.target).parent().parent();

    // Set the id of item to edit into the hidden field.
    var idOfItemToEdit = $(itemToEdit).attr('id');
    ELEM.idOfItemBeingEdited.val(idOfItemToEdit);

    // TODO: Get image url to display it on the edit modal.
    // This is used to temporarily store data of item to edit.
    var dataOfItemToEdit = {};
    dataOfItemToEdit.img = $(itemToEdit).attr('data-img');
    dataOfItemToEdit.name = $(itemToEdit).find('.itemName').html();
    dataOfItemToEdit.description = $(itemToEdit).attr('data-desc');
    dataOfItemToEdit.brand = $(itemToEdit).attr('data-brand');
    dataOfItemToEdit.ctg = $(itemToEdit).attr('data-ctg');
    dataOfItemToEdit.cnd = $(itemToEdit).attr('data-cnd');

    // If we found the item (and in general we always should),
    // use the data to set the fields of the modal used to edit the item.
    if (dataOfItemToEdit) {
        // TODO: How to get URL value or encode?
        // Put image url in <input type='file'> for sending data.
        // ELEM.itemImg.val(dataOfItemToEdit.img);

        // Put image url in <img src='#'> for displaying prev image.
        $('#prevImg').attr('src', dataOfItemToEdit.img);
        $('#prevImg').css('display', 'block');

        ELEM.itemName.val(dataOfItemToEdit.name);
        ELEM.itemDesc.val(dataOfItemToEdit.description);
        ELEM.itemBrand.val(dataOfItemToEdit.brand);
        ELEM.itemCtg.val(dataOfItemToEdit.ctg);
        ELEM.itemCnd.val(dataOfItemToEdit.cnd);
        // This makes the save button enabled, because now the fields have data (of item to edit).
        checkData();
    }
    // Show the modal.
    ELEM.addEditModal.modal('toggle');
}


function sendMessageHandler(e) {
    e.preventDefault();

    $.ajax({
        method: 'POST',
        url: `${clear_baseURL}/message`,
        data: {
            senderID: userID,
            recipientID: $('#modal-item-userID').val(),
            sender: name,
            recipient: ELEM.modalItemUserName.val(),
            itemName: ELEM.modalItemName.val(),
            message: ELEM.messageText.val()
        },
        headers: { 'x-access-token': token },
        success: function(res) {
            ELEM.messageText.val('');
            alert('Success.', res);
            ELEM.itemModal.modal('toggle');
        },
        error: function(res) {
            alert('fail', res);
        },
    });
}

// Display message modal when user click message icon.
function messageModalHandler() {
    // Get the all messages from server.
    getMessages(displayMessagesModal);
}

function displayMessagesModal(messages) {
    if (messages.length === 0) {
        return;
    }
    // Render the messages user received.
    generateMessages(messages);

    // Show the modal.
    ELEM.messageInboxModal.modal('toggle');
}

// Get the all messages from server.
function getMessages(callback) {
    $.ajax({
        method: "GET",
        url: `${clear_baseURL}/message/` + userID,
        headers: { 'x-access-token': token },
        success: function(messages) {
            var numUnread = [];
            messages.forEach(message => {
                if (!message.isRead) {
                    numUnread.push(message);
                }
            });
            $('#numUnread').html(numUnread.length);

            if (callback) {
                callback(messages);
            }
        }
    });
}

// Render the all messages.
function generateMessages(messages) {
    // First wipe out the messages in the UI so we don't add duplicates.
    ELEM.messagesContainer.empty();

    // Operate on each data message we have.
    messages.forEach(message => {
        // We create the new message top-level div based on the message id in the data.
        const divElement = $('<div class="message" id="' + message._id + '"></div>');
        divElement.attr('recipientID', message.senderID);
        divElement.attr('recipient', message.sender);
        divElement.attr('itemName', message.itemName);

        const replyContainer = $(`<div style="display:none" id="replyContainer"></div>`);
        const replyTextarea = $(`<textarea class="replyTextarea"></textarea>`);
        const replyBtn = $(`<button class="replyBtn">REPLY</button>`);

        var toolsContainer = $('<div class="tools-container d-flex justify-content-end"></div>');
        const messageRemoveIcon = '<i class="fa fa-times deleteIcon" aria-hidden="true" id="messageRemoveIcon"></i>';
        const messageReplyIcon = `<i class="fas fa-reply" id="messageReplyIcon"></i>`;

        const messageContainer = $(`<div id="messageContainer"></div>`);
        // Change text color into gray IF isRead === true.
        if (message.isRead) {
            $(messageContainer).addClass('read');
        }
        const senderElement = `<p class="senderName">Sender: ${message.sender}</p>`;
        const itemNameElement = `<p class="itemName">Item: ${message.itemName}</p>`;
        const messageElement = `<p class="messageContent">Message: ${message.message}</p>`;

        replyContainer.append(replyTextarea);
        replyContainer.append(replyBtn);
        toolsContainer.append(messageRemoveIcon);
        toolsContainer.append(messageReplyIcon);
        messageContainer.append(senderElement);
        messageContainer.append(itemNameElement);
        messageContainer.append(messageElement);
        divElement.append(replyContainer);
        divElement.append(toolsContainer);
        divElement.append(messageContainer);
        ELEM.messagesContainer.append(divElement);

        // Set click handlers for the delete icons.
        $('#' + message._id).find('#messageRemoveIcon').click(removeMessage);
        // Set click handlers for the reply icons.
        $('#' + message._id).find('#messageReplyIcon').click(displayReplyForm);
        // Set click handlers for isRead each message.
        $('#' + message._id).find('#messageContainer').click(isReadHandler);
        // Set click handlers for reply each message.
        $('#' + message._id).find('.replyBtn').click(sendReplyMessageHandler);
        // Set validation for reply.
        $('#' + message._id).find('.replyTextarea').keyup(checkReplyInputData);
        $('#' + message._id).find('.replyTextarea').change(checkReplyInputData);
        $('#' + message._id).find('.replyBtn').prop('disabled', true);
    });
}

// Check if textarea is empty or not.
function checkReplyInputData(e) {
    const idOfMessageToReply = $(e.target).parent().parent().attr('id');

    if ($(`#${idOfMessageToReply}`).find('.replyTextarea').val() === '') {
        $(`#${idOfMessageToReply}`).find('.replyBtn').prop('disabled', true);
    } else {
        $(`#${idOfMessageToReply}`).find('.replyBtn').prop('disabled', false);
    }
}

// Delete each message on the message modal.
function removeMessage(e) {
    if (confirm("Are you sure?")) {
        var messageToRemove = $(e.target).parent().parent();
        var idOfMessageToRemove = $(messageToRemove).attr('id');

        $.ajax({
            method: 'DELETE',
            url: `${clear_baseURL}/message/` + idOfMessageToRemove,
            headers: { 'x-access-token': token },
            success: function(res) {
                getMessages();
            }
            })
            .done(function( msg ) {
              alert( "Deleting message succeeded: " + msg );
            });
    }
    return false;
}

function displayReplyForm(e) {
    var idOfMessageToReply = $(e.target).parent().parent().attr('id');

    $('#' + idOfMessageToReply).find('#replyContainer').css('display', 'flex');
}

function sendReplyMessageHandler(e) {
    e.preventDefault();
    var messageToReply = $(e.target).parent().parent();

    var recipientID = messageToReply.attr('recipientID');
    var recipientName = messageToReply.attr('recipient');
    var itemName = messageToReply.attr('itemName');
    var replyMessage = $(messageToReply).find('.replyTextarea').val();

    $.ajax({
        method: 'POST',
        url: `${clear_baseURL}/message`,
        data: {
            senderID: userID,
            recipientID: recipientID,
            sender: name,
            recipient: recipientName,
            itemName: itemName,
            message: replyMessage
        },
        headers: { 'x-access-token': token },
        success: function(res) {
            alert('Success.', res);
            ELEM.messageInboxModal.modal('toggle');
        },
        error: function(res) {
            alert('fail', res);
        },
    });
}

function isReadHandler(e) {
    var target = $( e.target );
    var idOfEachMessage = $(target).parent().attr('id');
    var idOfEachMessage2 = $(target).parent().parent().attr('id');

    if (target.is('div')) {
        $.ajax({
            method: 'PUT',
            url: `${clear_baseURL}/message/` + idOfEachMessage,
            data: {
                isRead: true
            },
            headers: { 'x-access-token': token },
            success: function(message) {
                getMessages();
                if (message.isRead) {
                    $(target).addClass('read');
                }
            }
            });
    } else if (target.is('p')) {
        $.ajax({
            method: 'PUT',
            url: `${clear_baseURL}/message/` + idOfEachMessage2,
            data: {
                isRead: true
            },
            headers: { 'x-access-token': token },
            success: function(message) {
                getMessages();
                if (message.isRead) {
                    $(target).parent().addClass('read');
                }
            }
            });
    }
}


function getProfile() {
    $.ajax({
        method: "GET",
        url: `${clear_baseURL}/users/` + userID,
        headers: { 'x-access-token': token },
        success: function(user) {
            displayProfileModal(user);
        }
    });
}

function displayProfileModal(user) {
    ELEM.modalProfileName.html(`Name: ${user.name}`);
    ELEM.modalProfileEmail.html(`Email: ${user.email}`);
    ELEM.modalProfileDob.html(`Date of birth: ${user.dob}`);
    ELEM.modalProfileGender.html(`Gender: ${user.gender}`);
    ELEM.modalProfileLocation.html(`Location: ${user.location}`);
    ELEM.modalProfileDesc.html(`Description: ${user.description}`);

    ELEM.profileModal.modal('toggle');
}


// Reset the modal fields, and the item to edit id.
function resetValues() {
    ELEM.itemImg.val('');
    $('#prevImg').css('display', 'none');
    ELEM.itemName.val('');
    ELEM.itemDesc.val('');
    ELEM.itemBrand.val('');
    ELEM.itemCtg.val('');
    ELEM.itemCnd.val('');
    ELEM.idOfItemBeingEdited.val('');
    checkData();
}


// Logout when user click logout link.
function logout() {
    if (confirm("Logout?")) {
        $.ajax({
            method: "GET",
            url: `${clear_baseURL}/api/auth/logout/` + userID,
            headers: { 'x-access-token': token },
            success: function() {
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('user_id');
                window.location.href = `${baseURL}/index.html`;
            }
        });
    }
    return false;
}





















