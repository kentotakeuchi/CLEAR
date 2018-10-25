// Variable to store HTML element references, for greater code clarity.
var ELEM = {};
var searchText = '';
var saveMode = 'add';
var token = localStorage.getItem('token');
var email = localStorage.getItem('userEmail');

// Perform tasks that are dependent on the HTML being rendered (being ready).
$('document').ready(function() {
    // Capture HTML element references.
    getElementReferences();

    // Set event handlers.
    setEventHandlers();

    // Get all items for current user.
    getItems('example@mail.com');

    // Generate items for data available when page is rendered.
    // generateItems();

    $(document).keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchText = $('#searchInput').val();
            console.log(searchText);
            searchHandler(searchText, false, showEntireSearchResults);
            clearSearchHandler();
        }
    });
    $('#searchInput').keyup(function() {
        searchText = $('#searchInput').val();
        console.log(searchText);
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
    ELEM.modalItemName = $('.modal-item-name');
    ELEM.modalItemImg = $('.modal-item-img');
    ELEM.modalItemDesc = $('.modal-item-desc');
    ELEM.modalItemBrand = $('.modal-item-brand');
    ELEM.modalItemCtg = $('.modal-item-ctg');
    ELEM.modalItemCnd = $('.modal-item-cnd');
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

    // Ensure when the modal appears cursor is in name field.
    ELEM.addEditModal.on('shown.bs.modal', function() {
        ELEM.itemName.trigger('focus');
    });
}


// Display each item's modal when user click their images.
function displayItem(event) {
    var itemID = $(event.target).parent().attr('id');
    var url = "http://localhost:3000/items/example@mail.com/" + itemID;
    $.ajax({
        method: "GET",
        url: url,
        headers: { 'x-access-token': token },
        success: function(item) {
            showItemModal2(item);
        },
        error: function(res) {
            console.log(res);
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
            url: 'http://localhost:3000/items/search',
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
    console.log('clicked -> showItemModal');

    ELEM.modalItemName.html('<h3>' + data[0].name + '</h3>');
    ELEM.modalItemImg.html('<img src="' + data[0].img + '" style="width:100%"></img>');
    ELEM.modalItemDesc.html('Description:   ' + data[0].desc);
    ELEM.modalItemBrand.html('Brand:          ' + data[0].brand);
    ELEM.modalItemCtg.html('Category:      ' + data[0].ctg);
    ELEM.modalItemCnd.html('Condition:     ' + data[0].cnd);

    ELEM.itemModal.modal('toggle');
}

// For main section.
function showItemModal2(item) {
    console.log('clicked -> showItemModal2');

    ELEM.modalItemName.html('<h3>' + item.name + '</h3>');
    ELEM.modalItemImg.html('<img src="' + item.img + '" style="width:100%"></img>');
    ELEM.modalItemDesc.html('Description:   ' + item.desc);
    ELEM.modalItemBrand.html('Brand:         ' + item.brand);
    ELEM.modalItemCtg.html('Category:      ' + item.ctg);
    ELEM.modalItemCnd.html('Condition:     ' + item.cnd);

    ELEM.itemModal.modal('toggle');
}

// Pop up the item modal user searched.
function searchItemClicked(event) {
    console.log(event);
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

    // Set modal title to reflect we are in 'add' mode.
    ELEM.modalTitle.html('ADD ITEM');

    // Show the modal.
    ELEM.addEditModal.modal('toggle');
}

// Handler to save data from the add/edit modal.
function saveItemHandler(event) {
    event.preventDefault();
    // Temporarily capture data from modal.
    var form = ELEM.itemForm.get()[0];
    var formData = new FormData(form);
    var email = localStorage.getItem('userEmail');
    formData.append('userEmail', email);

    var id = ELEM.idOfItemBeingEdited.val();

    // Save the data to the data store.
    var method = saveMode === 'add' ? 'POST' : 'PUT';
    var url = 'http://localhost:3000/items';
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
            console.log('saved', res);
            getItems('example@mail.com');
        },
        error: function(res) {
            console.log('fail', res);
        },
        done: function (res) {
            console.log('done', done);
        },
        });

    // Close the modal if in edit mode.
    if (ELEM.addEditModalTitle.html() === 'EDIT ITEM') {
        ELEM.addEditModal.modal('toggle');
    }
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
});

// Disable/enable save button depending on
// whether or not required data has been entered.
function checkData() {
    if (ELEM.itemImg.val() === '' || ELEM.itemName.val() === '' || ELEM.itemDesc.val() === '' || ELEM.itemBrand.val() === '' || ELEM.itemCtg.val() === null || ELEM.itemCnd.val() === null) {
        ELEM.saveItemBtn.prop('disabled', true);
    } else {
        ELEM.saveItemBtn.prop('disabled', false);
    }
}

// Get all items for current user.
function getItems() {
    console.log('get items');
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/items/" + email,
        headers: { 'x-access-token': token },
        success: function(items) {
            console.log(items);
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
        var toolsContainer = $('<div class="tools-container"></div>');

        // Create the edit and delete icon.
        var removeIcon = '<i class="fa fa-times" aria-hidden="true" id="removeIcon"></i>';
        var editIcon = '<i class="fas fa-pen" data-toggle="modal" data-target="#editItemModal" id="editIcon"></i>';

        // Add the edit and delete icon to the tools container.
        toolsContainer.append(editIcon);
        toolsContainer.append(removeIcon);

        // Create the UI elements for the new item,
        // setting their data from the item data.
        var width = getRandomSize(300, 500);
        var height =  getRandomSize(300, 500);
        var imgElement = '<img class="itemImg grow" src="' + item.img + '" width="' + width + '" height="' + height + '"></img>';

        var nameElement = '<p class="itemName">' + item.name + '</p>';

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

        // Hide edit/delete icon IF the item was not created by user.
        if (item.userEmail !== email) {
            $('.tools-container').css('display', 'none');
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
            url: 'http://localhost:3000/items/' + idOfItemToRemove,
            headers: { 'x-access-token': token },
            success: function() {
                // Regenerate items and now the deleted item will not appear,
                // because we removed the data for the item to remove.
                getItems('example@mail.com');
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

    // This is used to temporarily store data of item to edit.
    var dataOfItemToEdit = {};
    dataOfItemToEdit.img = $(itemToEdit).find('.itemImg').html();
    dataOfItemToEdit.name = $(itemToEdit).find('.itemName').html();
    dataOfItemToEdit.description = $(itemToEdit).attr('data-desc');
    dataOfItemToEdit.brand = $(itemToEdit).attr('data-brand');
    dataOfItemToEdit.ctg = $(itemToEdit).attr('data-ctg');
    dataOfItemToEdit.cnd = $(itemToEdit).attr('data-cnd');

    // If we found the item (and in general we always should),
    // use the data to set the fields of the modal used to edit the item.
    if (dataOfItemToEdit) {
        ELEM.itemImg.val(dataOfItemToEdit.img);
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

// Reset the modal fields, and the item to edit id.
function resetValues() {
    ELEM.itemImg.val('');
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
            url: "http://localhost:3000/api/auth/logout",
            headers: { 'x-access-token': token },
            success: function() {
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                window.location.href = '/index.html';
            }
        });
    }
    return false;
}





















