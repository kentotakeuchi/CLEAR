function loadHeader1(title) {
    $('#header-1').load( "/components/header-1.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#pageTitle').html(title);
            $('#wrapper').css('display', 'block');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#header-1" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}

function loadHeader2(page) {
    $('#header-2').load( "/components/header-2.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#wrapper').css('display', 'block');
            if (page === 'settingsPage' || page === 'passwordPage') {
                navbarChangeHandler2(page);
            }
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#header-2" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}

function navbarChangeHandler2(page) {
    // The info of search results.
    var listElement = `<li class="nav-item p-2"><a href="./settings.html"><small class="default-color s-black">SETTINGS
    </small></a></li>
    <li class="nav-item p-2"><a href="./password.html"><small class="default-color p-black">PASSWORD
    </small></a></li>`;

    // Hide the title on the header-2.
    $('.hide').css('display', 'none');

    // Display the info of search results on the header-2.
    $('#sub-nav-ul').append(listElement);

    if (page === 'passwordPage') {
        $('.p-black').css('color', 'black');
    } else if (page === 'settingsPage') {
        $('.s-black').css('color', 'black');
    }
}

function loadRightArea(id) {
    $('#rightArea').load( "/components/rightArea.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#wrapper').css('display', 'block');
            $('#' + id).css('color', 'black');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#rightArea" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}

function loadFooter(id) {
    $('#footer').load( "/components/footer.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#wrapper').css('display', 'block');
            $('#' + id).css('color', 'black');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#footer" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}