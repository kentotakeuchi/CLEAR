var ELEM = {};

var itemsData = [{
    id: 1,
    name: 'Sample Item One',
    desc: 'Description of sample item one.'
}, {
    id: 2,
    name: 'Sample Item Two',
    desc: 'Description of sample item two.'
}];

$('document').ready(function() {
    getElementReferences();

    setEventHandlers();

    generateItems();
});


function getElementReferences() {
    ELEM.idOfItemBeingEdited = $('#idOfItemBeingEdited');
    ELEM.items = $('#items');
    ELEM.addEditModal = $('#addEditModal');
    ELEM.modalTitle = $('.modalTitle');
    ELEM.addEditModalTitle = $('#addEditModalTitle');
    ELEM.itemImg = $('#item-img');
    ELEM.itemName = $('#item-name');
    ELEM.itemDesc = $('#item-desc');
    ELEM.itemBrand = $('#item-brand');
    ELEM.itemCtg = $('#item-ctg');
    ELEM.itemCnd = $('#item-cnd');
    ELEM.addItemBtn = $('#addItemBtn');
    ELEM.saveItemBtn = $('#saveItemBtn');
}


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
}


function addItemHandler() {
    
    resetValues();

    ELEM.modalTitle.html('ADD ITEM');

    ELEM.addEditModal.modal('toggle');

    ELEM.itemImg.focus();
}


function saveItemHandler() {
    
    var img = ELEM.itemImg.val();
    var name = ELEM.itemName.val();
    var desc = ELEM.itemDesc.val();
    var brand = ELEM.itemBrand.val();
    var ctg = ELEM.itemCtg.val();
    var cnd = ELEM.itemCnd.val();

    saveItem(img, name, desc, brand, ctg, cnd);

    if (ELEM.addEditModalTitle.html() === 'EDIT ITEM') {
        ELEM.addEditModal.modal('toggle');
    }
}


function checkData() {
    if (ELEM.itemImg.val() === '' || ELEM.itemName.val() === '' || ELEM.itemDesc.val() === '' || ELEM.itemBrand.val() === '' || ELEM.itemCtg.val() === '' || ELEM.itemCnd.val() === '') {
        ELEM.saveItemBtn.prop('disabled', true);
    } else {
        ELEM.saveItemBtn.prop('disabled', false);
    }
}


function saveItem(iImg, iName, iDesc, iBrand, iCtg, iCnd) {
    
    var idOfItemToEdit = parseInt(ELEM.idOfItemBeingEdited.val());

    var dataOfItemToEdit;

    itemsData.forEach(function(item) {
        if (item.id === idOfItemToEdit) {
            dataOfItemToEdit = item;
        }
    });

    if (dataOfItemToEdit) {
        dataOfItemToEdit.img = ELEM.itemImg.val();
        dataOfItemToEdit.name = ELEM.itemName.val();
        dataOfItemToEdit.desc = ELEM.itemDesc.val();
        dataOfItemToEdit.brand = ELEM.itemBrand.val();
        dataOfItemToEdit.ctg = ELEM.itemCtg.val();
        dataOfItemToEdit.cnd = ELEM.itemCnd.val();
    } else {
        itemsData.push({
            id: itemsData.length + 1,
            img: iImg,
            name: iName,
            desc: iDesc,
            brand: iBrand,
            ctg: iCtg,
            cnd: iCnd
        });
    }

    generateItems();

    resetValues();
}


function generateItems() {

    ELEM.items.empty();

    itemsData.forEach(function(item) {

        var divElement = $('<div class="item" id="' + item.id + '"></div>');

        var toolsContainer = $('<div class="tools-container"></div>');
        
        var removeIcon = '<i class="fa fa-times" aria-hidden="true" id="removeIcon"></i>';
        var editIcon = '<i class="fas fa-pen" data-toggle="modal" data-target="#editItemModal" id="editIcon"></i>';

        toolsContainer.append(editIcon);
        toolsContainer.append(removeIcon);

        var imgElement = '<img>' + item.img + '</img>';
        var nameElement = '<h4 class="itemName">' + item.name + '</h4>';
        var descElement = '<p>' + item.desc + '</p>';
        var brandElement = '<p>' + item.brand + '</p>';
        var ctgElement = '<p>' + item.ctg + '</p>';
        var cndElement = '<p>' + item.cnd + '</p>';

        divElement.append(toolsContainer);

        divElement.append(imgElement);
        divElement.append(nameElement);
        divElement.append(descElement);
        divElement.append(brandElement);
        divElement.append(ctgElement);
        divElement.append(cndElement);

        ELEM.items.append(divElement);

        $('#' + item.id).find('#removeIcon').click(removeItem);
        $('#' + item.id).find('#editIcon').click(editItem);
    });
}


function removeItem(event) {
    
    var itemToRemove = $(event.target).parent().parent();

    var idOfItemToRemove = parseInt($(itemToRemove).attr('id'));

    itemsData = itemsData.filter(function(item) {
        return item.id !== idOfItemToRemove;
    });

    generateItems();
}


function editItem(event) {

    ELEM.addEditModalTitle.html('EDIT ITEM');

    var itemToEdit = $(event.target).parent().parent();

    var idOfItemToEdit = parseInt($(itemToEdit).attr('id'));
    ELEM.idOfItemBeingEdited.val(idOfItemToEdit);

    var dataOfItemToEdit;

    itemsData.forEach(function(item) {
        if (item.id === idOfItemToEdit) {
            dataOfItemToEdit = item;
        }
    });

    if (dataOfItemToEdit) {
        // ELEM.itemImg.val(dataOfItemToEdit.img);
        ELEM.itemName.val(dataOfItemToEdit.name);
        ELEM.itemDesc.val(dataOfItemToEdit.desc);
        ELEM.itemBrand.val(dataOfItemToEdit.brand);
        ELEM.itemCtg.val(dataOfItemToEdit.ctg);
        ELEM.itemCnd.val(dataOfItemToEdit.cnd);
        
        checkData();
    }
    
    ELEM.addEditModal.modal('toggle');

    ELEM.itemImg.focus();
}


function resetValues() {
    ELEM.itemImg.val('');
    ELEM.itemName.val('');
    ELEM.itemDesc.val('');
    ELEM.itemBrand.val('');
    ELEM.itemCtg.val('');
    ELEM.itemCnd.val('');
    checkData();
}















































/*
// after loading the page
$('document').ready(function() {
    checkData();
    $('#saveItemBtn').prop('disable', true);
    generateItems();
});

$('#item-img').change(function() {
    checkData();
});
$('#item-name').change(function() {
    checkData();
});
$('#item-desc').change(function() {
    checkData();
});
$('#item-brand').change(function() {
    checkData();
});
$('#item-ctg').change(function() {
    checkData();
});
$('#item-cnd').change(function() {
    checkData();
});

// Open add item modal
$('#addItemBtn').click(addItemHandler);
function addItemHandler() {
    $('.modal-title').html('ADD ITEM');
    $('#item-img').val('');
    $('#item-name').val('');
    $('#item-desc').val('');
    $('#item-brand').val('');
    $('#item-ctg').val('');
    $('#item-cnd').val('');
    $('#addEditModal').modal('toggle');
}

// Whether ADD button is disable or not
function checkData() {
    var itemImg = $('#item-img');
    var itemName = $('#item-name');
    var itemDesc = $('#item-desc');
    var itemBrand = $('#item-brand');
    var itemCtg = $('#item-ctg');
    var itemCnd= $('#item-cnd');
    if (itemImg.val() === '' || itemName.val() === '' || itemDesc.val() === '' || itemBrand.val() === '' || itemCtg.val() === '' || itemCnd.val() === '') {
        $('#saveItemBtn').prop('disabled', true);
    } else {
        $('#saveItemBtn').prop('disabled', false);
    }
}


var itemsData = [{
    id: 1,
    name: 'Sample Item One',
    description: 'Description of sample item one.'
}, {
    id: 2,
    name: 'Sample Item Two',
    description: 'Description of sample item two.'
}];

// Save item
$('#saveItemBtn').click(function() {
    var img = $('#item-img').val();
    var name = $('#item-name').val();
    var desc = $('#item-desc').val();
    var brand = $('#item-brand').val();
    var ctg = $('#item-ctg').val();
    var cnd = $('#item-cnd').val();
    saveItem(img, name, desc, brand, ctg, cnd);
});
function saveItem(iImg, iName, iDesc, iBrand, iCtg, iCnd) {
    var idOfItemToEdit = parseInt($('#idOfItemBeingEdited').val());
    var dataOfItemToEdit;
    itemsData.forEach(function(item) {
        if (item.id === idOfItemToEdit) {
            dataOfItemToEdit = item;
        }
    });
    if (dataOfItemToEdit) {
        dataOfItemToEdit.img = $('#item-img').val();
        dataOfItemToEdit.name = $('#item-name').val();
        dataOfItemToEdit.description = $('#item-desc').val();
        dataOfItemToEdit.brand = $('#item-brand').val();
        dataOfItemToEdit.ctg = $('#item-ctg').val();
        dataOfItemToEdit.cnd = $('#item-cnd').val();
    } else {
        itemsData.push({
            id: itemsData.length + 1,
            img: iImg,
            name: iName,
            description: iDesc,
            brand: iBrand,
            ctg: iCtg,
            cnd: iCnd
        });
    }
    generateItems();
    clearForm();
}

function clearForm() {
    $('#item-img').val('');
    $('#item-name').val('');
    $('#item-desc').val('');
    $('#item-brand').val('');
    $('#item-ctg').val('');
    $('#item-cnd').val('');
    checkData();
    $('#idOfItemBeingEdited').val('');
}

// Render items
function generateItems() {
    $('#items').empty();
    itemsData.forEach(function(item) {
        var divElement = $('<div class="item" id="' + item.id + '"></div>');
        
        var toolsContainer = $('<div class="tools-container"></div>')
        var removeIcon = '<i class="fa fa-times" aria-hidden="true" id="removeIcon"></i>';
        var editIcon = '<i class="fas fa-pen" data-toggle="modal" data-target="#editItemModal" id="editIcon"></i>';
        toolsContainer.append(editIcon);
        toolsContainer.append(removeIcon);
        
        var imgElement = '<img>' + item.img + '</img>';
        var nameElement = '<h4>' + item.name + '</h4>';
        var descElement = '<p>' + item.description + '</p>';     
        var brandElement = '<p>' + item.brand + '</p>';                
        var ctgElement = '<p>' + item.ctg + '</p>';                
        var cndElement = '<p>' + item.cnd + '</p>';  
        divElement.append(toolsContainer);              
        divElement.append(imgElement);
        divElement.append(nameElement);
        divElement.append(descElement);
        divElement.append(brandElement);
        divElement.append(ctgElement);
        divElement.append(cndElement);
        $('#items').append(divElement);
        
        $('#' + item.id).find('#removeIcon').click(removeItem);
        $('#' + item.id).find('#editIcon').click(editItem);
    });
}

// Remove item handler
function removeItem(event) {
    var itemToRemove = $(event.target).parent().parent();
    var idOfItemToRemove = parseInt($(itemToRemove).attr('id'));
    itemsData = itemsData.filter(function(item) {
        return item.id !== idOfItemToRemove;
    });
    generateItems();
}

// Open edit item modal
function editItem(event) {
    var itemToEdit = $(event.target).parent().parent();
    var idOfItemToEdit = parseInt($(itemToEdit).attr('id'));
    $('#addEditModalTitle').html('EDIT ITEM');
    $('#idOfItemBeingEdited').val(idOfItemToEdit);
    var dataOfItemToEdit;
    itemsData.forEach(function(item) {
        if (item.id === idOfItemToEdit) {
            dataOfItemToEdit = item;
        }
    });
    if (dataOfItemToEdit) {
        // $('#item-img').val(dataOfItemToEdit.img);
        $('#item-name').val(dataOfItemToEdit.name);
        $('#item-desc').val(dataOfItemToEdit.description);
        $('#item-brand').val(dataOfItemToEdit.brand);
        $('#item-ctg').val(dataOfItemToEdit.ctg);
        $('#item-cnd').val(dataOfItemToEdit.cnd);
        checkData();
    }
    $('#addEditModal').modal('toggle');
}
*/


